import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import Search from 'views/Search';
import UserP from 'views/User';
import BoardDetail from 'views/Board/Detail';
import BoardWrite from 'views/Board/Write';
import BoardUpdate from 'views/Board/Update';
import Container from 'layouts/Container';
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
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { signInUserRequest } from './apis';
import { SignInUserResponseDto } from './apis/response/user';
import { ApiResponseDto } from './apis/response';
import useSignInUserStore from './stores/login-user.store';

/**
 *  TODO: component: Application 컴포넌트
 * */
function App() {
  /**
   *  TODO: state: 로그인 유저 상태
   * */
  const { setSignInUser, resetSignInUser } = useSignInUserStore();

  /**
   *  TODO: state: accessToken cookie 상태
   * */
  const [cookie, setCookie] = useCookies();

  /**
   *  TODO: function: sign in user response
   * */
  const signInUserResponse = (responseBody: ApiResponseDto<SignInUserResponseDto> | null) => {
    if (!responseBody) return;

    const { code, data } = responseBody;

    if (code === 'AF' || code === 'NFU' || code === 'DBE') {
      resetSignInUser();
      return;
    }

    if (data) {
      const { email, username, profileImage } = data;
      const signInUser = { email, username, profileImage };
      setSignInUser(signInUser);
    }

  };

  /**
   *  TODO: effect: accessToken cookie 함수
   * */
  useEffect(() => {
    if (!cookie.accessToken) {
      resetSignInUser();
      return;
    }
    signInUserRequest(cookie.accessToken).then(signInUserResponse);
  }, [cookie.accessToken]);

  /**
   *  TODO:  render: Application 컴포넌트 렌더링
   * */
  return (
    <Routes>
      <Route element={<Container />}>
        <Route path='/' element={<Navigate to={AUTH_PATH()} replace />} />
        <Route path={MAIN_PATH()} element={<Main />} />
        <Route path={AUTH_PATH()} element={<Authentication />} />
        <Route path={SEARCH_PATH(':searchWord')} element={<Search />} />
        <Route path={USER_PATH(':email')} element={<UserP />} />
        <Route path={BOARD_PATH()}>
          <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />} />
          <Route path={BOARD_DETAIL_PATH(':boardId')} element={<BoardDetail />} />
          <Route path={BOARD_UPDATE_PATH(':boardId')} element={<BoardUpdate />} />
        </Route>
        <Route path='*' element={<h1>404 NOT FOUND</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
