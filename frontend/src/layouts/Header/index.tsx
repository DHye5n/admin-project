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
import { useBoardStore } from 'stores';
import useSignInUserStore from 'stores/login-user.store';

/**
 *  TODO: component: Header 레이아웃 컴포넌트
 * */
export default function Header() {
  /**
   *  TODO:  state: 상태
   * */
  const { signInUser, setSignInUser, resetSignInUser } = useSignInUserStore();

  const { pathname } = useLocation();

  const [cookie, setCookie] = useCookies();

  const [isSignIn, setSignIn] = useState<boolean>(false);

  const [isAuthPage, setAuthPage] = useState<boolean>(false);

  const [isMainPage, setMainPage] = useState<boolean>(false);

  const [isSearchPage, setSearchPage] = useState<boolean>(false);

  const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);

  const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);

  const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);

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
    const { email } = useParams<{ email: string }>();

    /**
     *  TODO: event handler: 마이페이지 버튼 클릭 이벤트 처리 함수
     * */
    const onMyPageButtonClickHandler = () => {
      if (!signInUser) return;
      navigate(USER_PATH(signInUser.email));
    };

    /**
     *  TODO: event handler: 로그아웃 버튼 클릭 이벤트 처리 함수
     * */
    const onSignOutButtonClickHandler = () => {
      resetSignInUser();
      setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() });
      navigate(AUTH_PATH());
    };

    /**
     *  TODO: event handler: 로그인 버튼 클릭 이벤트 처리 함수
     * */
    const onSignInButtonClickHandler = () => {
      navigate(AUTH_PATH());
    };

    console.log('email:', email);
    console.log('signInUser.email:', signInUser?.email);
    console.log('signInUser:', signInUser);

    /**
     *  TODO: render: 로그아웃 버튼 컴포넌트 렌더링
     * */
    if (isSignIn && email && signInUser?.email && email === signInUser?.email)
      return (
        <div className='white-button' onClick={onSignOutButtonClickHandler}>
          {'로그아웃'}
        </div>
      );

    /**
     *  TODO: render: 마이페이지 버튼 컴포넌트 렌더링
     * */
    if (isSignIn)
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

    const isBoardWritePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
    setBoardWritePage(isBoardWritePage);

    const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(''));
    setBoardDetailPage(isBoardDetailPage);

    const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(''));
    setBoardUpdatePage(isBoardUpdatePage);

    const isUserPage = pathname.startsWith(USER_PATH(''));
    setUserPage(isUserPage);
  }, [pathname]);

  useEffect(() => {
    console.log(signInUser);
    setSignIn(signInUser !== null);
  }, [signInUser]);

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
          {isSignIn && signInUser && (
            <div className="user-info">
              <div className='user-info-profile-image'>
                {signInUser.profileImage}
              </div>
              <div className='user-info-username'>
                <span>{signInUser.username}</span>
              </div>
            </div>
              )}
        </div>
      </div>
    </div>
  );
}
