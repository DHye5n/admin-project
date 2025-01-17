import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { AUTH_PATH, MAIN_PATH, SEARCH_PATH } from 'constant';
import { BoardListItem } from 'types/interface';
import { latestBoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import Pagination from 'components/Pagination';
import { usePagination } from 'hooks';
import { getRelationListRequest, getSearchBoardListRequest } from 'apis';
import { ApiResponseDto } from 'apis/response';
import { GetSearchBoardListResponseDto } from 'apis/response/board';
import { GetRelationListResponseDto } from 'apis/response/search';

/**
 *  TODO: component: Search 컴포넌트
 * */
export default function Search() {
  /**
   *  TODO: state: 상태
   * */
  const { searchWord } = useParams();

  const [preSearchWord, setPreSearchWord] = useState<string | null>(null);

  const [cookie, setCookie] = useCookies();

  const [searchBoardList, setSearchBoardList] = useState<BoardListItem[]>([]);

  const [count, setCount] = useState<number>(2);

  const [relationList, setRelationList] = useState<string[]>([]);

  const {
    currentPage,
    setCurrentPage,
    currentSection,
    setCurrentSection,
    viewList,
    viewPageList,
    totalSection,
    setTotalList } = usePagination<BoardListItem>(5);

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

  const getSearchBoardListResponse = (responseBody: ApiResponseDto<GetSearchBoardListResponseDto> | null) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code !== 'SU') {
      handleApiError(code);
      return;
    }

    if (!searchWord) return;

    const { searchList } = responseBody.data as GetSearchBoardListResponseDto;
    setTotalList(searchList);
    setCount(searchList.length);
    setPreSearchWord(searchWord);
  }

  const getRelationListResponse = (responseBody: ApiResponseDto<GetRelationListResponseDto> | null) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code !== 'SU') {
      handleApiError(code);
      return;
    }

    const { relationWordList } = responseBody.data as GetRelationListResponseDto;
    setRelationList(relationWordList);
  }

  /**
   *  TODO: effect: 마운트 시 실행될 함수
   * */
  useEffect(() => {
    const accessToken = cookie.accessToken;
    if (!checkLoginStatus(accessToken)) return;

    if (!searchWord) return;

    getSearchBoardListRequest(searchWord, preSearchWord, accessToken).then(getSearchBoardListResponse);
    getRelationListRequest(searchWord, accessToken).then(getRelationListResponse);

  }, [searchWord]);

  /**
   *  TODO:  render: Search 컴포넌트 렌더링
   * */
  if (!searchWord) return (<></>)
  return (
    <div id='search-wrapper'>
      <div className='search-container'>
        <div className='search-title-box'>
          <div className="search-title">
            <span className="search-emphasis">{searchWord}</span>
            {'에 대한 '}
            <span className='search-emphasis'>{count}</span>
            {'건의 검색 결과입니다.'}
          </div>
        </div>

        <div className="search-relation-box">
          <div className="search-relation-card">
            <div className="search-relation-card-container">
              <div className="search-relation-card-title">관련 검색어</div>
              {relationList.filter(word => word.trim() !== "").length === 0 ?
                (<div className="search-relation-card-contents-nothing">
                  {'관련 검색어가 없습니다.'}
                </div>) :
                (<div className="search-relation-card-contents">
                  {relationList.filter(word => word.trim() !== "").map((word, index) => (
                      <div key={index} className="word-badge" onClick={() => onRelationWordClickHandler(word)}>
                        {word}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='search-contents-box'>
          {count === 0 ?
            <div className="search-contents-nothing">{'검색 결과가 없습니다.'}</div> :
            <div className="search-contents">
              {viewList.map(boardListItem => <BoardItem boardListItem={boardListItem} />)}
            </div>
          }
        </div>

        <div className='search-pagination-box'>
          {count !== 0 &&
            <Pagination currentPage={currentPage} currentSection={currentSection}
                        setCurrentPage={setCurrentPage} setCurrentSection={setCurrentSection}
                        viewPageList={viewPageList} totalSection={totalSection} />
          }
        </div>
      </div>
    </div>
  )
}
