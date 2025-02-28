import './style.css';
import BoardWrite from 'views/Board/Write';
import { useLocation, useParams } from 'react-router-dom';
import React from 'react';
import BoardDetail from 'views/Board/Detail';
import BoardUpdate from 'views/Board/Update';
import Main from 'views/Main';
import Search from 'views/Search';
import UserPage from 'views/User';
import BoardRead from 'views/Board/Read';
import UserList from 'views/User/List';

export default function Content() {
  /**
   *  TODO:  state: 현재 페이지 path name 상태
   * */
  const { pathname } = useLocation();
  const { searchWord } = useParams();

  return (
    <div id='content'>
      {pathname.startsWith('/boards/write') && <BoardWrite />}
      {pathname.startsWith('/boards/list') && <BoardRead />}
      {pathname.startsWith('/boards/update') && <BoardUpdate />}
      {pathname.startsWith('/boards/detail') && <BoardDetail />}

      {pathname.startsWith('/dashboard') && <Main />}
      {pathname.startsWith('/search') && searchWord && <Search />}
      {pathname.startsWith('/users/profile') && <UserPage />}
      {pathname.startsWith('/users/list') && <UserList />}
    </div>
  );
}