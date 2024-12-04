import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import './style.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  AUTH_PATH,
  BOARD_DETAIL_PATH,
  BOARD_PATH,
  BOARD_UPDATE_PATH,
  BOARD_WRITE_PATH,
  MAIN_PATH,
  SEARCH_PATH,
  USER_PATH,
} from 'constant';
import { useCookies } from 'react-cookie';
import { useBoardStore, useLoginUserStore } from 'stores';

/**
 *  TODO: component: Header 레이아웃 컴포넌트
 * */
export default function Header() {
  /**
   *  TODO:  state: 로그인 유저 상태
   * */
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();

  /**
   *  TODO:  state: path 상태
   * */
  const { pathname } = useLocation();

  /**
   *  TODO:  state: cookie 상태
   * */
  const [cookie, setCookie] = useCookies();

  /**
   *  TODO:  state: 로그인 상태
   * */
  const [isLogin, setLogin] = useState<boolean>(false);

  /**
   *  TODO:  state: 인증 페이지 상태
   * */
  const [isAuthPage, setAuthPage] = useState<boolean>(false);

  /**
   *  TODO:  state: 메인 페이지 상태
   * */
  const [isMainPage, setMainPage] = useState<boolean>(false);

  /**
   *  TODO:  state: 검색 페이지 상태
   * */
  const [isSearchPage, setSearchPage] = useState<boolean>(false);

  /**
   *  TODO:  state: 게시물 작성 페이지 상태
   * */
  const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);

  /**
   *  TODO:  state: 게시물 상세 페이지 상태
   * */
  const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);

  /**
   *  TODO:  state: 게시물 수정 페이지 상태
   * */
  const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);

  /**
   *  TODO:  state: 유저 페이지 상태
   * */
  const [isUserPage, setUserPage] = useState<boolean>(false);

  /**
   *  TODO:  function: navigate 함수
   * */
  const navigate = useNavigate();

  /**
   *  TODO:  event handler: 로고 클릭 이벤트 처리 함수
   * */
  const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
  };

  /**
   *  TODO: component: 검색 버튼 컴포넌트
   * */
  const SearchButton = () => {
    /**
     *  TODO:  state: 검색 버튼 요소 참조 상태
     * */
    const searchButtonRef = useRef<HTMLDivElement | null>(null);

    /**
     *  TODO:  state: 검색 버튼 상태
     * */
    const [status, setStatus] = useState<boolean>(false);

    /**
     *  TODO:  state: 검색어 상태
     * */
    const [word, setWord] = useState<string>('');

    const { searchWord } = useParams();

    /**
     *  TODO:  event handler: 검색어 변경 이벤트 처리 함수
     * */
    const onSearchWordChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      setWord(event.target.value);
    };

    /**
     *  TODO:  event handler: 검색어 키 이벤트 처리 함수
     * */
    const onSearchWordKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== 'Enter') return;
      if (!searchButtonRef.current) return;
      searchButtonRef.current?.click();
    };

    /**
     *  TODO:  event handler: 검색 버튼 클릭 이벤트 처리 함수
     * */
    const onSearchButtonClickHandler = () => {
      if (!status) {
        setStatus(true);
        return;
      }
      if (word.trim() === '') {
        setStatus(false);
        return;
      }
      if (word) {
        navigate(SEARCH_PATH(word));
      }
    };

    /**
     *  TODO:  effect
     * */
    useEffect(() => {
      if (searchWord !== undefined) {
        setWord(searchWord);
        setStatus(true);
      }
    }, [searchWord]);

    if (!status)
      /**
       *  TODO:  render: 검색 버튼 컴포넌트 렌더링 false 상태
       * */
      return (
        <div className='icon-button' onClick={onSearchButtonClickHandler}>
          <div className='icon search-light-icon'></div>
        </div>
      );
    /**
     *  TODO:  render: 검색 버튼 컴포넌트 렌더링 true 상태
     * */
    return (
      <div className='header-search-input-box'>
        <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={word}
          onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler} />
        <div ref={searchButtonRef} className='icon-button' onClick={onSearchButtonClickHandler}>
          <div className='icon search-light-icon'></div>
        </div>
      </div>
    );
  };

  /**
   *  TODO: component: 마이페이지 버튼 컴포넌트
   * */
  const MyPageButton = () => {
    /**
     *  TODO: state: USER email path 상태
     * */
    const { email } = useParams();

    /**
     *  TODO: event handler: 마이페이지 버튼 클릭 이벤트 처리 함수
     * */
    const onMyPageButtonClickHandler = () => {
      if (!loginUser) return;
      const { email } = loginUser;
      navigate(USER_PATH(email));
    };

    /**
     *  TODO: event handler: 로그아웃 버튼 클릭 이벤트 처리 함수
     * */
    const onMySignOutButtonClickHandler = () => {
      resetLoginUser();
      navigate(MAIN_PATH());
    };

    /**
     *  TODO: event handler: 로그인 버튼 클릭 이벤트 처리 함수
     * */
    const onSignInButtonClickHandler = () => {
      navigate(AUTH_PATH());
    };

    /**
     *  TODO: render: 로그아웃 버튼 컴포넌트 렌더링
     * */
    if (isLogin && email === loginUser?.email)
      return (
        <div className='white-button' onClick={onMySignOutButtonClickHandler}>
          {'로그아웃'}
        </div>
      );

    if (isLogin)
      /**
       *  TODO: render: 마이페이지 버튼 컴포넌트 렌더링
       * */
      return (
        <div className='white-button' onClick={onMyPageButtonClickHandler}>
          {'마이페이지'}
        </div>
      );

    /**
     *  TODO: render: 로그인 버튼 컴포넌트 렌더링
     * */
    return (
      <div className='blue-button' onClick={onSignInButtonClickHandler}>
        {'로그인'}
      </div>
    );
  };

  /**
   *  TODO: component: 업로드 버튼 컴포넌트
   * */
  const UploadButton = () => {
    /**
     *  TODO: state: 게시물 상태
     * */
    const { title, content, boardImageFileList, resetBoard } = useBoardStore();

    /**
     *  TODO: event handler: 업로드 버튼 클릭 이벤트 처리 함수
     * */
    const onUploadButtonClickHandler = () => {};

    /**
     *  TODO: render: 업로드 버튼 컴포넌트 렌더링
     * */
    if (title && content)
      return (
        <div className='blue-button' onClick={onUploadButtonClickHandler}>
          {'업로드'}
        </div>
      );

    /**
     *  TODO: render: 업로드 불가 버튼 컴포넌트 렌더링
     * */
    return <div className='disable-button'>{'업로드'}</div>;
  };

  /**
   *  TODO:  effect: path가 변경될 때마다 실행될 함수
   * */
  useEffect(() => {
    const isAuthPage = pathname.startsWith(AUTH_PATH());
    setAuthPage(isAuthPage);
    const isMainPage = pathname === MAIN_PATH();
    setMainPage(isMainPage);
    const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
    setSearchPage(isSearchPage);
    const isBoardWritePage = pathname.startsWith(
      BOARD_PATH() + '/' + BOARD_WRITE_PATH()
    );
    setBoardWritePage(isBoardWritePage);
    const isBoardDetailPage = pathname.startsWith(
      BOARD_PATH() + '/' + BOARD_DETAIL_PATH('')
    );
    setBoardDetailPage(isBoardDetailPage);
    const isBoardUpdatePage = pathname.startsWith(
      BOARD_PATH() + '/' + BOARD_UPDATE_PATH('')
    );
    setBoardUpdatePage(isBoardUpdatePage);
    const isUserPage = pathname.startsWith(USER_PATH(''));
    setUserPage(isUserPage);
  }, [pathname]);

  /**
   *  TODO:  render: Header 레이아웃 컴포넌트 렌더링
   * */
  return (
    <div id='header'>
      <div className='header-container'>
        <div className='header-left-box' onClick={onLogoClickHandler}>
          <div className='icon-box'>
            <div className='icon logo-dark-icon'></div>
          </div>
          <div className='header-logo'>{'DHy25n'}</div>
        </div>
        <div className='header-right-box'>
          {(isAuthPage || isMainPage || isSearchPage || isBoardDetailPage) && (
            <SearchButton />
          )}
          {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage) && (
            <MyPageButton />
          )}
          {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
        </div>
      </div>
    </div>
  );
}
