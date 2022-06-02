import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Helmet} from 'react-helmet'

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


import './singleComic.scss';
import AppBanner from '../appBanner/AppBanner';

const setContent = (process, Component, data, comicId) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return <Spinner/>;
            break;
        case 'confirmed':
            return <Component item={data} comicId={comicId} />;
            break;
        case 'error':
            return <ErrorMessage/>;
            break;
        default: 
            throw new Error('Unexpected process state');
            break;
    }
}


const SingleComic = () => {
    const {comicId, charName} = useParams();
    const [item, setItem] = useState(null);
    const {process, setProcess, getComic, clearError, getCharByName} = useMarvelService();

    useEffect(() => {
        updateItem()
    }, [comicId, charName]);

    const updateItem = () => {
        clearError()
        if (comicId) {
            getComic(comicId)
            .then(onItemLoaded)  
            .then(() => setProcess('confirmed')) 
        }
        if (charName) {
            getCharByName(charName)
                .then(onItemLoaded) 
                .then(() => setProcess('confirmed')) 
        } 
    }

    const onItemLoaded = (item) => {
        setItem(item)
    }
    
    return (
        <>
            <AppBanner/>
            {setContent(process, View, item, comicId)}
        </>
    )
}

const View = ({item, comicId}) => {
    const  {title, name, description, pageCount, price,thumbnail, language} = item;
    const navigate = useNavigate();

    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content={`${title} ${comicId ? `comics` : `character`} book`}
                    />
                <title>{title}</title>
            </Helmet>
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title ? title : name}</h2>
                <p className="single-comic__descr">{description}</p>
                {comicId ? <>
                    <p className="single-comic__descr">{pageCount}</p>
                    <p className="single-comic__descr">Language: {language}</p>
                    <div className="single-comic__price">{price}</div> 
                </> : null}
            </div>
            <div onClick={() => navigate(-1)} className="single-comic__back">Back to all</div>
        </div>
    )
}

export default SingleComic;