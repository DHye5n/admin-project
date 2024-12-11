import './style.css';
import BoardWrite from 'views/Board/Write';
import { useLocation } from 'react-router-dom';
import { BOARD_WRITE_PATH, MAIN_PATH } from '../../constant';

export default function Content() {
  /**
   *  TODO:  state: 현재 페이지 path name 상태
   * */
  const { pathname } = useLocation();

  return (
    <div id='content'>
      {pathname.startsWith('/board/write') && <BoardWrite />}
      {pathname === MAIN_PATH() && <div>메인페이지</div>}
    </div>
  );
}