import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import Main from "views/Main";
import Authentication from "views/Authentication";
import Search from "views/Search";
import User from "views/User";
import BoardDetail from "views/Board/Detail";
import BoardWrite from "views/Board/Write";
import BoardUpdate from "views/Board/Update";
import Container from "layouts/Container";
import {
    AUTH_PATH,
    BOARD_DETAIL_PATH,
    BOARD_PATH, BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    MAIN_PATH,
    SEARCH_PATH,
    USER_PATH
} from "constant";

/**
 *  TODO: component: Application 컴포넌트
 * */
function App() {

    /**
     *  TODO:  render: Application 컴포넌트 렌더링
     * */
   return (
       <Routes>
           <Route element={<Container />}>
               <Route path={ MAIN_PATH() } element={<Main />} />
               <Route path={ AUTH_PATH() } element={<Authentication />} />
               <Route path={ SEARCH_PATH(':searchWord') } element={<Search />} />
               <Route path={ USER_PATH(':email') } element={<User />} />
               <Route path={ BOARD_PATH() }>
                   <Route path={ BOARD_WRITE_PATH() } element={<BoardWrite />} />
                   <Route path={ BOARD_DETAIL_PATH(':boardId') } element={<BoardDetail />} />
                   <Route path={ BOARD_UPDATE_PATH(':boardId') } element={<BoardUpdate />} />
               </Route>
               <Route path='*' element={ <h1>404 NOT FOUND</h1> } />
           </Route>
       </Routes>
   );
}

export default App;
