import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './comicsList.scss';

const ComicsList = () => {
    const [comicData, setComicData] = useState([]);
    const [offset, setOffset] = useState(300);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();


    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
        .then(onComicsListLoaded)
    }

    useEffect(() => {
        onRequest(offset, true)
    }, []);

    const onComicsListLoaded = (newComicsData) => {
        let ended = false;
        if (newComicsData.length < 8) {
            ended = true;
        }
        setComicData([...comicData, ...newComicsData]);
        setNewItemLoading(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    }

    // const timeout = 300;

    const renderItems = (data) => {
        const items = data.map((item, i) => {
            return (
                <CSSTransition key={i} timeout={700} classNames="transitions">
                    <li key={i} 
                        className="comics__item">
                        <Link to={`/comics/${item.id}`}>
                            <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
                            <div className="comics__item-name">{item.title}</div>
                            <div className="comics__item-price">{item.price}</div>
                        </Link>     
                    </li>    
                </CSSTransition>
            )
        })
        return (
            <TransitionGroup className="comics__grid">
                {items}
            </TransitionGroup>
        )  
    }
    const items = renderItems(comicData)

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;