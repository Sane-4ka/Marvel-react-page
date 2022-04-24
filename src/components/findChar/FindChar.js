import { useState, useEffect } from 'react';
import { useField, Formik, Field, Form, ErrorMessage as FormikErrorMes, FieldArray } from 'formik';
import * as Yup from 'yup';

import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './FindChar.scss'

const FindChar = () => {
    const [char, setChar] = useState(null);
    const [conclusion, setConclusion] = useState(null)
    const {loading, error, getCharByName, clearError} = useMarvelService();

    // const inpComponent = ({label, ...props}) => {
    // const [field, meta] = useField();    
    // return ()
    // }
   

    const findChar = (charName) => {
        clearError();
        getCharByName(charName)
            .then(charData => setChar(charData))
    }

    useEffect(() => {    
            setConclusion(<div className="find-char__conslusion-block find-char__block">
                { char === null ? null : !char.length > 0 ? 
                    <>
                        <div className="page__text good">{`There is! Visit ${char.name} page?`}</div>
                        <Link to={`/characters/${char.name}`} className="find-char__sec-btn button button__secondary">
                            <div className="inner">TO PAGE</div>
                        </Link>
                    </>
                    :
                    <div className="page__text error">The character was not found. Check the name and try again</div>
                }
            </div>)
    }, [char]);

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;

    return (
        <>
        <Formik
            initialValues={{
                charName: '',
            }}
            validationSchema = {Yup.object({
                charName: Yup.string()
                        .required('Required field'),
            })}
            onSubmit = { ({charName}) => {
                findChar(charName);
            }}
        > 
        <Form className="char__find find-char">
                <label htmlFor='charName' className="find-char__title">Or find a character by name:</label>
                <div className="find-char__inp-block find-char__block">
                    <Field 
                        id='charName'
                        name='charName'
                        type="text" 
                        placeholder='Enter name' 
                        className="find-char__input" 
                    />
                    <button 
                        type='submit' 
                        className="button button__main"
                        disabled={loading}>
                        <div className="inner">find</div>
                    </button>
                </div>
                <FormikErrorMes name='charName'>{msg => {
                    return (
                        <div className="find-char__conslusion-block find-char__block">
                            <div className="page__text error">{msg}</div>
                        </div>    
                    )
                }}
                </FormikErrorMes>
                {conclusion}
                {/* {console.log(FieldArray)} */}
                {/* {formik.values.charName.length = 0 ? conclusion : null} */}
            </Form>  
        </Formik>
        {errorMessage}
        </>
    ) 
}

export default FindChar;