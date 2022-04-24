import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Helmet} from 'react-helmet'

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './singleComic.scss';
import AppBanner from '../appBanner/AppBanner';

const SingleComic = () => {
    const {comicId, charName} = useParams();
    const [item, setItem] = useState(null);
    const {loading, error, getComic, clearError, getCharByName} = useMarvelService();

    useEffect(() => {
        updateItem()
    }, [comicId, charName]);

    const updateItem = () => {
        clearError()
        if (comicId) {
            getComic(comicId)
            .then(onItemLoaded)   
        }
        if (charName) {
            getCharByName(charName)
                .then(onItemLoaded) 
        } 
    }

    const onItemLoaded = (item) => {
        setItem(item)
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !item) ? <View item={(item)} comicPage={comicId} /> : null;

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({item, comicPage}) => {
    const  {title, name, description, pageCount, price,thumbnail, language} = item;
    const navigate = useNavigate();

    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content={`${title} ${comicPage ? `comics` : `character`} book`}
                    />
                <title>{title}</title>
            </Helmet>
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title ? title : name}</h2>
                <p className="single-comic__descr">{description}</p>
                {comicPage ? <>
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