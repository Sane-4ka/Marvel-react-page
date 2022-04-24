import {Helmet} from 'react-helmet'

import ComicsList from '../comicsList/ComicsList';
import AppBanner from "../appBanner/AppBanner";

const ComicsPage = (props) => {

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Page with list of our comics"
                    />
                <title>Comics page</title>
            </Helmet>
            <AppBanner/>
            <ComicsList onComicSelected={props.onComicSelected}/>
        </>
    )
}

export default ComicsPage