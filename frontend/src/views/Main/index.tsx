import './style.css';
import Top3Item from 'components/Top3Item';
import { useEffect, useState } from 'react';
import { BoardListItem } from 'types/interface';
import BoardItem from 'components/BoardItem';
import Pagination from 'components/Pagination';
import { useNavigate } from 'react-router-dom';
import { AUTH_PATH, MAIN_PATH, SEARCH_PATH } from 'constant';
import { getLatestBoardListRequest, getPopularListRequest, getTop3BoardListRequest } from 'apis';
import { ApiResponseDto } from 'apis/response';
import { GetTop3BoardListResponseDto } from 'apis/response/board';
import { useCookies } from 'react-cookie';
import { usePagination } from 'hooks';
import { GetLatestBoardListResponseDto } from 'apis/response/board';
import { GetPopularListResponseDto } from 'apis/response/search';

/**
 *  TODO: component: Main 컴포넌트
 * */
export default function Main() {
  /**
   *  TODO: state: 상태
   * */
  const [top3List, setTop3List] = useState<BoardListItem[]>([]);

  const [cookie, setCookie] = useCookies();

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

  const getTop3BoardListResponse = (responseBody: ApiResponseDto<GetTop3BoardListResponseDto> | null) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code !== 'SU') {
      handleApiError(code);
      return;
    }

    const { top3List } = responseBody.data as GetTop3BoardListResponseDto;
    setTop3List(top3List);
  };

  /**
   *  TODO: effect: 마운트 시 실행될 함수
   * */
  useEffect(() => {
    const accessToken = cookie.accessToken;
    if (!checkLoginStatus(accessToken)) return;

    getTop3BoardListRequest(accessToken).then(getTop3BoardListResponse);
  }, []);

  /**
   *  TODO: component: Main 상단 컴포넌트
   * */
  const MainTop = () => {
    return (
      <div id='main-top-wrapper'>
        <div className='main-top-container'>
          <div className='main-top-contents-box'>
            <div className='main-top-contents-title'>{'주간 Top3 게시물'}</div>
            <div className='main-top-contents'>
              {top3List.map((top3ListItem, index) => (
                <Top3Item key={top3ListItem.boardId || index} top3ListItem={top3ListItem} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  };

  /**
   *  TODO: component: Main 하단 컴포넌트
   * */
  const MainBottom = () => {
    /**
     *  TODO: state: 상태
     * */
    const [latestList, setLatestList] = useState<BoardListItem[]>([]);

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
     *  TODO: function: 함수
     * */
    const getLatestBoardListResponse = (responseBody: ApiResponseDto<GetLatestBoardListResponseDto> | null) => {
      if (!responseBody) return;

      const { code } = responseBody;
      if (code !== 'SU') {
        handleApiError(code);
        return;
      }

      const { latestList } = responseBody.data as GetLatestBoardListResponseDto;
      setTotalList(latestList);
    }

    /**
     *  TODO: effect: 마운트 시 실행될 함수
     * */
    useEffect(() => {
      const accessToken = cookie.accessToken;
      if (!checkLoginStatus(accessToken)) return;

      getLatestBoardListRequest(accessToken).then(getLatestBoardListResponse);
    }, []);

    return (
      <div id='main-bottom-wrapper'>
        <div className='main-bottom-container'>
          <div className="main-bottom-contents-box">
            <div className="main-bottom-title">{'최신 게시물'}</div>

            <div className="main-bottom-latest-contents-box">
              {viewList.map((boarListItem) => (
                <BoardItem key={boarListItem.boardId} boardListItem={boarListItem} />
              ))}
            </div>

          </div>
          <div className="main-bottom-pagination-box">
          <Pagination currentPage={currentPage} currentSection={currentSection}
                      setCurrentPage={setCurrentPage} setCurrentSection={setCurrentSection}
                      viewPageList={viewPageList} totalSection={totalSection}/>
          </div>
        </div>
      </div>
    )
  };

  /**
   *  TODO: component: Main 하단 컴포넌트
   * */
  const MainBottom2 = () => {
    /**
     *  TODO: state: 상태
     * */
    const [popularWordList, setPopularWordList] = useState<string[]>([]);

    /**
     *  TODO: function: 함수
     * */
    const getPopularListResponse = (responseBody: ApiResponseDto<GetPopularListResponseDto> | null) => {
      if (!responseBody) return;

      const { code } = responseBody;
      if (code !== 'SU') {
        handleApiError(code);
        return;
      }

      const { popularWordList } = responseBody.data as GetPopularListResponseDto;
      setPopularWordList(popularWordList);
    }

    /**
     *  TODO: event handler: 클릭 이벤트 처리 함수
     * */
    const onPopularWordClickHandler = (word: string) => {
      navigator(SEARCH_PATH(word));
    }

    /**
     *  TODO: effect: 마운트 시 실행될 함수
     * */
    useEffect(() => {
      const accessToken = cookie.accessToken;
      if (!checkLoginStatus(accessToken)) return;

      getPopularListRequest(accessToken).then(getPopularListResponse);
    }, []);

    return (
      <div id='main-bottom-wrapper'>
        <div className='main-bottom-container'>
          <div className="main-bottom-contents-box">
            <div className="main-bottom-title">{'인기 검색어'}</div>

            <div className='main-bottom-popular-card'>
              <div className="main-bottom-popular-contents-box">
                {popularWordList.map(word => <div className="word-badge" onClick={() => onPopularWordClickHandler(word)}>{word}</div>)}
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  };

  /**
   *  TODO:  render: Main 컴포넌트 렌더링
   * */
  return (
    <>
      <MainTop />
      <div className='main-bottom-container-box'>
        <MainBottom />
        <MainBottom2 />
      </div>
    </>
  )
}
