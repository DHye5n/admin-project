import BoardItem from 'components/BoardItem';
import Pagination from 'components/Pagination';
import { AUTH_PATH, BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { useEffect, useState } from 'react';
import { usePagination } from 'hooks';
import { BoardListItem } from 'types/interface';
import { getAllBoardListRequest } from 'apis';
import { useCookies } from 'react-cookie';
import { ApiResponseDto } from 'apis/response';
import { GetAllBoardListResponseDto } from 'apis/response/board';


/**
 *  TODO: component: Board Read 컴포넌트
 * */
export default function BoardRead() {
  /**
   *  TODO:  state: 상태
   * */
  const navigator = useNavigate();

  const [count, setCount] = useState<number>();

  const [cookie, setCookie] = useCookies();

  /**
   *  TODO: function: 함수
   * */
  const checkLoginStatus = (accessToken: string | undefined) => {
    if (!accessToken) {
      navigator(AUTH_PATH());
      return false;
    }
    return true;
  };

  const handleApiError = (code: string) => {
    switch (code) {
      case 'NFB':
        alert('존재하지 않는 게시물입니다.');
        navigator(MAIN_PATH());
        break;
      case 'DBE':
        alert('데이터베이스 오류입니다.');
        navigator(AUTH_PATH());
        break;
      case 'VF':
        alert('잘못된 접근입니다.');
        navigator(MAIN_PATH());
        break;
      case 'NFU':
        alert('존재하지 않는 유저입니다.');
        navigator(MAIN_PATH());
        break;
      case 'AF':
        alert('인증에 실패했습니다.');
        navigator(AUTH_PATH());
        break;
      case 'NP':
        alert('권한이 없습니다.');
        navigator(MAIN_PATH());
        break;
      default:
        navigator(MAIN_PATH());
    }
  };

  const {
    currentPage,
    setCurrentPage,
    currentSection,
    setCurrentSection,
    viewList,
    viewPageList,
    totalSection,
    setTotalList,
  } = usePagination<BoardListItem>(5);

  const getAllBoardListResponse = (responseBody: ApiResponseDto<GetAllBoardListResponseDto> | null) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code !== 'SU') {
      handleApiError(code);
      return;
    }

    const { boardList } = responseBody.data as GetAllBoardListResponseDto;
    setTotalList(boardList);
    setCount(boardList.length);
  }

  /**
   *  TODO: event handler: 클릭 이벤트 처리
   * */
  const onWriteClickHandler = () => {
    navigator(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
  };

  /**
   *  TODO: effect: 마운트 시 실행할 함수
   * */
  useEffect(() => {
    const accessToken = cookie.accessToken;
    if (!checkLoginStatus(accessToken)) return;

    getAllBoardListRequest(accessToken).then(getAllBoardListResponse);

  }, []);

  /**
   *  TODO:  render: Board List 컴포넌트 렌더링
   * */
  return (
    <div id='board-read-wrapper'>
      <div className='board-read-container'>
        <div className="board-read-contents-box">
          <div className="board-read-top-box">
            <div className="board-read-title">
              {'게시물 목록'}
              <span className="read-divider">|</span>
              <span className="read-emphasis">
                게시물 총 {count}건
              </span>
            </div>
            <div className="board-read-write-box" onClick={onWriteClickHandler}>
              <div className="icon-box">
                <div className="icon edit-icon"></div>
              </div>
              <div className="user-bottom-side-text">{'글 작성'}</div>
            </div>
          </div>

          <div className='board-read-list-contents-box'>
            {count === 0 ?
              <div className="board-read-contents-nothing">{'게시물이 없습니다.'}</div> :
              <div className="board-read-contents">
                {viewList.map((boarListItem) => (
                  <BoardItem key={boarListItem.boardId} boardListItem={boarListItem} />
                ))}
              </div>
            }
          </div>
        </div>

        <div className="board-read-pagination-box">
          {count !== 0 &&
            <Pagination currentPage={currentPage} currentSection={currentSection}
                        setCurrentPage={setCurrentPage} setCurrentSection={setCurrentSection}
                        viewPageList={viewPageList} totalSection={totalSection} />
          }
        </div>

      </div>
    </div>
  );
}