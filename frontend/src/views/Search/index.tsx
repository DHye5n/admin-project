import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { AUTH_PATH, MAIN_PATH, SEARCH_PATH } from 'constant';
import { BoardListItem } from 'types/interface';
import { latestBoardListMock } from 'mocks';
import BoardItem from '../../components/BoardItem';
import Pagination from '../../components/Pagination';

/**
 *  TODO: component: Search 컴포넌트
 * */
export default function Search() {
  /**
   *  TODO: state: 상태
   * */
  const { searchWord } = useParams();

  const [cookie, setCookie] = useCookies();

  const [searchBoardList, setSearchBoardList] = useState<BoardListItem[]>([]);

  const [count, setCount] = useState<number>(2);

  const [relationList, setRelationList] = useState<string[]>([]);

  /**
   *  TODO: event handler: 클릭 이벤트 처리 함수
   * */
  const onRelationWordClickHandler = (word: string) => {
    navigator(SEARCH_PATH(word));
  };

  /**
   *  TODO: function: 함수
   * */
  const navigator = useNavigate();

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

  const checkLoginStatus = (accessToken: string | undefined) => {
    if (!accessToken) {
      navigator(AUTH_PATH());
      return false;
    }
    return true;
  };

  /**
   *  TODO: effect: 마운트 시 실행될 함수
   * */
  useEffect(() => {
    const accessToken = cookie.accessToken;
    if (!checkLoginStatus(accessToken)) return;

    setSearchBoardList(latestBoardListMock);

  }, [searchWord]);

  /**
   *  TODO:  render: Search 컴포넌트 렌더링
   * */
  if (!searchWord) return (<></>)
  return (
    <div id='search-wrapper'>
      <div className='search-container'>
        <div className='search-title-box'>
          <div className='search-title'>
            <span className='search-emphasis'>{searchWord}</span>
            {'에 대한 검색 결과입니다.'}
          </div>
          <div className='search-emphasis'>{count}</div>
        </div>
        <div className='search-contents-box'>
          {count === 0 ?
            <div className="search-contents-nothing">{'검색 결과가 없습니다.'}</div> :
            <div className="search-contents">{searchBoardList.map(boardListItem => <BoardItem
              boardListItem={boardListItem} />)}</div>
          }
          <div className="search-relation-box">
            <div className="search-relation-card">
              <div className="search-relation-card-container">
                <div className="search-relation-card-title"></div>
                {relationList.length === 0 ?
                  <div className='search-relation-card-contents-nothing'></div> :
                  <div className="search-relation-card-contents">
                    {relationList.map(word => <div className="word-badge"
                                                   onClick={() => onRelationWordClickHandler(word)}>{word}</div>)}
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <div className='search-pagination-box'>
          {/*<Pagination currentPage={} setCurrentPage={} currentSection={} setCurrentSection={} viewPageList={} totalSection={} />*/}
        </div>
      </div>
    </div>
  )
}
