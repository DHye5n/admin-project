import './style.css';
import BoardWrite from 'views/Board/Write';
import { useLocation } from 'react-router-dom';
import { BOARD_WRITE_PATH, MAIN_PATH } from 'constant';
import React from 'react';
import BoardDetail from 'views/Board/Detail';
import BoardUpdate from '../../views/Board/Update';

export default function Content() {
  /**
   *  TODO:  state: 현재 페이지 path name 상태
   * */
  const { pathname } = useLocation();

  return (
    <div id='content'>
      {pathname.startsWith('/boards/write') && <BoardWrite />}
      {pathname.startsWith('/boards/detail') && <BoardDetail />}
      {pathname.startsWith('/boards/update') && <BoardUpdate />}
      {pathname === MAIN_PATH() && <div>메인페이지</div>}
    </div>
  );
}