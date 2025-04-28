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
  BOARD_PATH, BOARD_READ_PATH,
  BOARD_UPDATE_PATH,
  BOARD_WRITE_PATH,
  MAIN_PATH,
  SEARCH_PATH, USER_LIST_PATH,
  USER_PATH,
} from 'constant';
import { useCookies } from 'react-cookie';
import useSignInUserStore from 'stores/login-user.store';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { closeOutline, mailOutline, searchOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';


/**
 *  TODO: component: Header 레이아웃 컴포넌트
 * */
export default function Header() {
  /**
   *  TODO:  state: 상태
   * */
  const { signInUser, setSignInUser, resetSignInUser } = useSignInUserStore(state => state);

  const { pathname } = useLocation();

  const [cookie, setCookie] = useCookies();

  const [isSignIn, setSignIn] = useState<boolean>(false);

  const [isAuthPage, setAuthPage] = useState<boolean>(false);

  const [isMainPage, setMainPage] = useState<boolean>(false);

  const [isSearchPage, setSearchPage] = useState<boolean>(false);

  const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);

  const [isBoardReadPage, setBoardReadPage] = useState<boolean>(false);

  const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);

  const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);

  const [isUserPage, setUserPage] = useState<boolean>(false);

  const [isUserList, setUserList] = useState<boolean>(false);

  /**
   *  TODO:  function: navigate 함수
   * */
  const navigator = useNavigate();

  /**
   *  TODO:  event handler: 로고 클릭 이벤트 처리 함수
   * */
  const onLogoClickHandler = () => {
    navigator(MAIN_PATH());
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

    const onClearButtonClickHandler = () => {
      setWord('');
    };

    /**
     *  TODO:  event handler: 검색 버튼 클릭 이벤트 처리 함수
     * */
    const onSearchButtonClickHandler = () => {
      if (word.trim() === '') {
        return;
      }
      if (word) {
        navigator(SEARCH_PATH(word));
      }
    };

    /**
     *  TODO:  effect
     * */
    useEffect(() => {
      if (searchWord !== undefined) {
        setWord(searchWord);
      }
    }, [searchWord]);

    /**
     *  TODO:  render: 검색 버튼 컴포넌트 렌더링
     * */
    return (
      <div className='header-search-input-box'>
        <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={word}
          onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler} />
        {word && (
          <div className='clear-button' onClick={onClearButtonClickHandler}>
            <IonIcon icon={closeOutline} style={{ width: '24px', height: '24px', color: 'rgba(0, 0, 0, 0.7)' }} />
          </div>
        )}
        <div ref={searchButtonRef} className='search-button' onClick={onSearchButtonClickHandler}>
          <IonIcon icon={searchOutline} style={{ width: '24px', height: '24px', color: 'rgba(0, 0, 0, 0.7)' }} />
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
    const { userId } = useParams<{ userId: string }>();

    /**
     *  TODO: event handler: 마이페이지 버튼 클릭 이벤트 처리 함수
     * */
    const onMyPageButtonClickHandler = () => {
      if (!signInUser) return;
      const { userId } = signInUser;
      navigator(USER_PATH(userId));
    };

    /**
     *  TODO: event handler: 로그인 버튼 클릭 이벤트 처리 함수
     * */
    const onSignInButtonClickHandler = () => {
      navigator(AUTH_PATH());
    };

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

    const isBoardReadPage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_READ_PATH());
    setBoardReadPage(isBoardReadPage);

    const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(''));
    setBoardDetailPage(isBoardDetailPage);

    const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(''));
    setBoardUpdatePage(isBoardUpdatePage);

    const isUserPage = pathname.startsWith(USER_PATH(''));
    setUserPage(isUserPage);

    const isUserList = pathname.startsWith(USER_LIST_PATH());
    setUserList(isUserList);

  }, [pathname]);

  useEffect(() => {
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

        <div className='header-middle-box'>
          {(isAuthPage || isUserPage || isUserList ||
            isBoardReadPage || isBoardWritePage || isBoardUpdatePage
            || isMainPage || isSearchPage || isBoardDetailPage) && (
            <SearchButton />
          )}
        </div>

        <div className='header-right-box'>
          <div className='popular-keyword-box'>

          </div>
          {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage || isUserList || isBoardReadPage || isBoardWritePage || isBoardUpdatePage) && (
            <MyPageButton />
          )}
          {isSignIn && signInUser && (
            <div className="user-info">
              <div className='user-info-profile-image-box'>
                <div className='user-info-profile-image' style={{
                  backgroundImage: `url(${signInUser.profileImage ? signInUser.profileImage : defaultProfileImage})`,
                }}>
                </div>
              </div>
              <div className='user-info-username'>
                <span>{signInUser.username}</span>
              </div>
              <div className='user-info-role'>
                <span>{signInUser.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
