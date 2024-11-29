import './style.css';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import InputBox from 'components/InputBox';
import { SignInRequestDto } from 'apis/request/auth';
import { signInRequest } from 'apis';
import { ApiResponseDto } from 'apis/response';
import { SignInResponseDto } from 'apis/response/auth';
import { useCookies } from 'react-cookie';
import { MAIN_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';

/**
 *   TODO:  component: Main Authentication 컴포넌트
 */
export default function Authentication() {
  /**
   *   TODO:  state: 로그인, 회원가입 상태
   */
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

  /**
   *   TODO:  event handler: 로그인, 회원가입 링크 클릭 이벤트 처리
   */
  const toggleView = (newView: 'sign-in' | 'sign-up') => {
    setView(newView);
  };

  return (
    <div id="wrapper">
      <div className='auth-wrapper'>
        <div className={`auth-container ${view}`}>
            {/* Sign-Up View */}
            {view === 'sign-in' && <SignInCard />}
            {/* Sign-In View */}
            {view === 'sign-up' && <SignUpCard />}
        </div>

        <div className={`toggle-container ${view}`}>
          {view === 'sign-in' ? (
              <div className="toggle-panel-box">
                <div className='toggle-panel-text'>Hello, Friend!</div>
                <div className='toggle-panel-text'>Sign up now to access all features.</div>
                <div className='auth-move-button' onClick={() => toggleView('sign-up')}>{'회원가입'}</div>
              </div>
          ) : (
              <div className="toggle-panel-box">
                <div className='toggle-panel-text'>Welcome Back!</div>
                <div className='toggle-panel-text'>Sign in to continue.</div>
                <div className='auth-move-button' onClick={() => toggleView('sign-in')}>{'로그인'}</div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 *   TODO:  component: 로그인 컴포넌트
 */
function SignInCard() {
  /**
   *   TODO:  state: 쿠키 상태
   */
  const [cookie, setCookie] = useCookies();

  /**
   *   TODO:  funtion: navitate 함수
   */
  const navigator = useNavigate();

  /**
   *   TODO:  state: 아이디 요소 참조 상태
   */
  const usernameRef = useRef<HTMLInputElement | null>(null);

  /**
   *   TODO:  state: 비밀번호 요소 참조 상태
   */
  const passwordRef = useRef<HTMLInputElement | null>(null);

  /**
   *   TODO:  state: 아이디 상태
   */
  const [username, setUsername] = useState<string>('');

  /**
   *   TODO:  state: 비밀번호 상태
   */
  const [password, setPassword] = useState<string>('');

  /**
   *   TODO:  state: 비밀번호 타입 상태
   */
  const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');

  /**
   *   TODO:  state: 비밀번호 아이콘 상태
   */
  const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

  /**
   *   TODO:  state: 에러 상태
   */
  const [error, setError] = useState<boolean>(false);

  /**
   *   TODO:  state: 아이디 저장 상태
   */
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  /**
   *   TODO:  effect: 컴포넌트 마운트 시 localStorage에서 아이디 불러오기
   */
  useEffect(() => {
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  /**
   *   TODO:  function: 로그인 처리 함수
   */
  const signInResponse = (responseBody: SignInResponseDto | ApiResponseDto | null) => {
    if (!responseBody) {
      alert('네트워크 이상입니다.');
      return;
    }

    const { code } = responseBody;
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    if (code === 'SF' || code === 'VF') setError(true);
    if (code !== 'SU') return;

    const { data } = responseBody;

    if (data) {
      const { token, expirationTime } = data;
      console.log('Expiration Time:', expirationTime);

      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);

      setCookie('accessToken', token, { expires, path: MAIN_PATH() });
      navigator(MAIN_PATH());
    } else {
      alert('Invalid response format.');
    }
  };

  /**
   *   TODO:  event handler: 아이디 변경 이벤트 처리
   */
  const onUsernameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value } = event.target;
    setUsername(value);
  }

  /**
   *   TODO:  event handler: 비밀번호 변경 이벤트 처리
   */
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value } = event.target;
    setPassword(value);
  }

  /**
   *   TODO:  event handler: 로그인 버튼 클릭 이벤트 처리
   */
  const onSignInButtonClickHandler = () => {
    if (!username || !password) {
      setError(true);
      return;
    }

    const requestBody: SignInRequestDto = { username, password };
    signInRequest(requestBody).then(signInResponse);


    if (rememberMe) {
      localStorage.setItem('savedUsername', username);
    } else {
      localStorage.removeItem('savedUsername');
    }
  };

  /**
   *   TODO:  event handler: 소셜 로그인 버튼 클릭 이벤트 처리
   */
  const handleSocialLogin = (provider: 'google' | 'github' | 'kakao') => {
    const redirectUri = 'http://localhost:3000/auth/callback'; // 인증 후 리다이렉트할 URL
    let authUrl = '';

    switch (provider) {
      case 'google':
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
        break;
      case 'github':
        authUrl = `https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID&redirect_uri=${redirectUri}&scope=user`;
        break;
      case 'kakao':
        authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=YOUR_KAKAO_CLIENT_ID&redirect_uri=${redirectUri}&response_type=code`;
        break;
    }

    window.location.href = authUrl; // 사용자 인증 페이지로 리다이렉트
  };

  /**
   *   TODO:  event handler: 비밀번호 버튼 클릭 이벤트 처리
   */
  const onPasswordButtonClickHandler = () => {
    if (passwordType === 'text') {
      setPasswordType('password');
      setPasswordButtonIcon('eye-light-off-icon');
    } else {
      setPasswordType('text');
      setPasswordButtonIcon('eye-light-on-icon');
    }
  };

  /**
   *   TODO:  event handler: 아이디 인풋 키 다운 이벤트 처리
   */
  const onUsernameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!passwordRef.current) return;
    passwordRef.current.focus();
  };

  /**
   *   TODO:  event handler: 아이디 인풋 키 다운 이벤트 처리
   */
  const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onSignInButtonClickHandler();
  };

  /**
   *   TODO:  render: 로그인 컴포넌트 렌더링
   */
  return (
    <div className="auth-card">
      <div className='auth-card-box'>
        <div className="auth-card-top">
          <div className="auth-card-title-box">
            <div className="auth-card-title">{'로그인'}</div>
          </div>
          <InputBox ref={usernameRef} label="아이디" type="text" placeholder="아이디를 입력해주세요."
                    error={error} value={username} onChange={onUsernameChangeHandler} onKeyDown={onUsernameKeyDownHandler} />
          <InputBox ref={passwordRef} label="비밀번호" type={passwordType} placeholder="비밀번호를 입력해주세요."
                    error={error} value={password} onChange={onPasswordChangeHandler} icon={passwordButtonIcon}
                    onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler} />
          <div className='remember-find-id-pwd-box'>
            <div className="remember-me-box">
              <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <label htmlFor="rememberMe">{'아이디 저장'}</label>
            </div>
            <div className="find-id-pwd-box">
              <div> |</div>
              <div className='find-id-link'>{'아이디 찾기'}</div>
              <div> |</div>
              <div className='find-pwd-link'>{'비밀번호 찾기'}</div>
            </div>
          </div>
        </div>

        <div className="auth-card-bottom">
          {error &&
            <div className="auth-sign-in-error-box">
              <div className="auth-sign-in-error-message">
                {'아이디 또는 비밀번호를 잘못 입력했습니다. \n입력하신 내용을 다시 확인해주세요.'}
              </div>
            </div>
          }
          <div className="auth-button" onClick={onSignInButtonClickHandler}>{'로그인'}</div>
        </div>

        <div className="social-login-box">
          <div className="icon github-icon" onClick={() => handleSocialLogin('github')}></div>
          <div className="icon google-icon" onClick={() => handleSocialLogin('google')}></div>
          <div className="icon kakao-icon" onClick={() => handleSocialLogin('kakao')}></div>
        </div>
      </div>
    </div>
  );
}

/**
 *   TODO:  component: 회원가입 컴포넌트
 */
function SignUpCard() {
  return (
    <div className="auth-card">
      <div>Sign up</div>
    </div>
  );
}


