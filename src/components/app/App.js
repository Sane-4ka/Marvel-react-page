import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import { SingleComicPage, MainPage, Page404, ComicsPage } from '../pages'
import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/spinner";
import { lazy, Suspense} from "react";
import { CSSTransition, TransitionGroup, SwitchTransition } from "react-transition-group";
import { useState, useEffect } from "react";

import './App.scss';

// const Page404 = lazy(() => import('../pages/404'))
// const MainPage = lazy(() => import('../pages/MainPage'))
// const ComicsPage = lazy(() => import('../pages/ComicsPage'))
// const SingleComicPage = lazy(() => import('../pages/SingleComicPage'))

const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        {/* <Routes> 
                            <Route path='/' element={<MainPage />} />                        
                            <Route path='/comics' element={<ComicsPage />} />
                            <Route path='/comics/:comicId' element={<SingleComicPage />} />
                            <Route path='*' element={<Page404 />} />
                        </Routes> */}
                        <Anim/>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

const Anim = () => {
    const location = useLocation();
    // console.log(location);

    const [transitionName, setTransitionName] = useState("fade");

    return (
      <TransitionGroup component={null}>
        <SwitchTransition mode="out-in">
        <CSSTransition key={location.key} classNames={transitionName} timeout={500}>
          <Routes location={location}>
            <Route path='/' element={<MainPage />} />                        
            <Route path='/comics' element={<ComicsPage />} />
            <Route path='/comics/:comicId' element={<SingleComicPage />} />
            <Route path='/characters/:charName' element={<SingleComicPage />} />
            <Route path='*' element={<Page404 />} />
          </Routes>
        </CSSTransition>
        </SwitchTransition>
      </TransitionGroup>
    );
  }
  

export default App;