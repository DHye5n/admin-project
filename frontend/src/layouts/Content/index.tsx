import './style.css';
import BoardWrite from 'views/Board/Write';
import { useLocation, useParams } from 'react-router-dom';
import React from 'react';
import BoardDetail from 'views/Board/Detail';
import BoardUpdate from 'views/Board/Update';
import Main from 'views/Main';
import Search from 'views/Search';

export default function Content() {
  /**
   *  TODO:  state: 현재 페이지 path name 상태
   * */
  const { pathname } = useLocation();
  const { searchWord } = useParams();

  return (
    <div id='content'>
      {pathname.startsWith('/boards/write') && <BoardWrite />}
      {pathname.startsWith('/boards/detail') && <BoardDetail />}
      {pathname.startsWith('/boards/update') && <BoardUpdate />}
      {pathname.startsWith('/dashboard') && <Main />}
      {pathname.startsWith('/search') && searchWord && <Search />}
    </div>
  );
}