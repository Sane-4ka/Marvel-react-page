import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
            break;
        case 'confirmed':
            return <Component/>;
            break;
        case 'error':
            return <ErrorMessage/>;
            break;
        default: 
            throw new Error('Unexpected process state');
            break;
    }
}

const ComicsList = () => {
    const [comicData, setComicData] = useState([]);
    const [offset, setOffset] = useState(300);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {getAllComics, process, setProcess} = useMarvelService();


    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
        .then(onComicsListLoaded)
        .then(() => setProcess('confirmed'))
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

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicData), newItemLoading)}
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