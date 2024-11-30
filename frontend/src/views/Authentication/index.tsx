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
   *   TODO:  state: 페이지 번호 상태
   */
  const [page, setPage] = useState<1 | 2>(1);

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
            <div className="auth-card-page">{`${page}/2`}</div>
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
  /**
   *   TODO:  state: 이메일 요소 참조 상태
   */
  const emailRef = useRef<HTMLInputElement | null>(null);

  /**
   *   TODO:  state: 비밀번호 요소 참조 상태
   */
  const passwordRef = useRef<HTMLInputElement | null>(null);

  /**
   *   TODO:  state: 비밀번호 확인 요소 참조 상태
   */
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);

  /**
   *   TODO:  state: 아이디 요소 참조 상태
   */
  const usernameRef = useRef<HTMLInputElement | null>(null);

  /**
   *   TODO:  state: 핸드폰 요소 참조 상태
   */
  const phoneRef = useRef<HTMLInputElement | null>(null);

  /**
   *   TODO:  state: 주소 요소 참조 상태
   */
  const addressRef = useRef<HTMLInputElement | null>(null);

  /**
   *   TODO:  state: 상세 주소 요소 참조 상태
   */
  const addressDetailRef = useRef<HTMLInputElement | null>(null);

  /**
   *   TODO:  state: 페이지 번호 상태
   */
  const [page, setPage] = useState<1 | 2>(2);

  /**
   *   TODO:  state: 이메일 상태
   */
  const [email, setEmail] = useState<string>('');

  /**
   *   TODO:  state: 비밀번호 상태
   */
  const [password, setPassword] = useState<string>('');

  /**
   *   TODO:  state: 비밀번호 확인 상태
   */
  const [passwordCheck, setPasswordCheck] = useState<string>('');

  /**
   *   TODO:  state: 아이디 상태
   */
  const [username, setUsername] = useState<string>('');

  /**
   *   TODO:  state: 핸드폰 상태
   */
  const [phone, setPhone] = useState<string>('');

  /**
   *   TODO:  state: 주소 상태
   */
  const [address, setAddress] = useState<string>('');

  /**
   *   TODO:  state: 상세 주소 상태
   */
  const [addressDetail, setAddressDetail] = useState<string>('');


  /**
   *   TODO:  state: 비밀번호 타입 상태
   */
  const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');

  /**
   *   TODO:  state: 비밀번호 체크 타입 상태
   */
  const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');

  /**
   *   TODO:  state: 이메일 에러 상태
   */
  const [isEmailError, setEmailError] = useState<boolean>(false);

  /**
   *   TODO:  state: 비밀번호 에러 상태
   */
  const [isPassword, setPasswordError] = useState<boolean>(false);

  /**
   *   TODO:  state: 비밀번호 확인 에러 상태
   */
  const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);

  /**
   *   TODO:  state: 아이디 에러 상태
   */
  const [isUsernameError, setUsernameError] = useState<boolean>(false);

  /**
   *   TODO:  state: 핸드폰 에러 상태
   */
  const [isPhoneError, setPhoneError] = useState<boolean>(false);

  /**
   *   TODO:  state: 주소 에러 상태
   */
  const [isAddressError, setAddressError] = useState<boolean>(false);

  /**
   *   TODO:  state: 상세 주소 에러 상태
   */
  const [isAddressDetailError, setAddressDetailError] = useState<boolean>(false);

  /**
   *   TODO:  state: 이메일 성공 메시지 상태
   */
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string>('');

  /**
   *   TODO:  state: 이메일 에러 메시지 상태
   */
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');

  /**
   *   TODO:  state: 패스워드 성공 메시지 상태
   */
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<string>('');

  /**
   *   TODO:  state: 비밀번호 에러 메시지 상태
   */
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');

  /**
   *   TODO:  state: 패스워드 성공 메시지 상태
   */
  const [passwordCheckSuccessMessage, setPasswordCheckSuccessMessage] = useState<string>('');

  /**
   *   TODO:  state: 비밀번호 확인 에러 메시지 상태
   */
  const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');

  /**
   *   TODO:  state: 아이디 에러 메시지 상태
   */
  const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>('');

  /**
   *   TODO:  state: 핸드폰 확인 에러 메시지 상태
   */
  const [phoneErrorMessage, setPhoneErrorMessage] = useState<string>('');

  /**
   *   TODO:  state: 주소 확인 에러 메시지 상태
   */
  const [addressErrorMessage, setAddressErrorMessage] = useState<string>('');

  /**
   *   TODO:  state: 상세 주소 확인 에러 메시지 상태
   */
  const [addressDetailErrorMessage, setAddressDetailMessage] = useState<string>('');

  /**
   *   TODO:  state: 비밀번호 버튼 아이콘 상태
   */
  const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

  /**
   *   TODO:  state: 비밀번호 확인 버튼 아이콘 상태
   */
  const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

  /**
   *   TODO:  이메일 유효성 검사 함수
   */
  const validateEmail = (email: string): { isValid: boolean; errorMessage: string } => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return {
        isValid: false,
        errorMessage: "올바른 이메일 형식을 입력해주세요."
      };
    }
    return {
      isValid: true,
      errorMessage: ""
    };
  };

  /**
   *   TODO:  event handler: 이메일 변경 이벤트 처리
   */
  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);

    if (value === "") {
      setEmailError(false);
      setEmailErrorMessage("");
      setEmailSuccessMessage("");
    } else {
      const { isValid, errorMessage } = validateEmail(value);
      setEmailError(!isValid);
      setEmailErrorMessage(errorMessage);

      if (isValid) {
        setEmailSuccessMessage("사용 가능한 이메일 주소입니다.");
      } else {
        setEmailSuccessMessage("");
      }
    }
  };

  /**
   *   TODO:  비밀번호 유효성 검사 함수
   */
  const validatePassword = (password: string): { isValid: boolean; errorMessage: string } => {
    const trimmedPassword = password.trim();

    if (trimmedPassword.length < 8 || trimmedPassword.length > 20) {
      return {
        isValid: false,
        errorMessage: "비밀번호는 8자 이상 20자 이하이어야 합니다."
      };
    }

    const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    if (!passwordPattern.test(trimmedPassword)) {
      return {
        isValid: false,
        errorMessage: "비밀번호는 숫자, 소문자, 대문자를 각각 하나 이상 포함해야 합니다."
      };
    }

    return {
      isValid: true,
      errorMessage: ""
    };
  };

  /**
   *   TODO:  event handler: 비밀번호 변경 이벤트 처리
   */
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);

    if (value === "") {
      setPasswordError(false);
      setPasswordErrorMessage("");
      setPasswordSuccessMessage("");
    } else {
      const { isValid, errorMessage } = validatePassword(value);
      setPasswordError(!isValid);
      setPasswordErrorMessage(errorMessage);

      if (isValid) {
        setPasswordSuccessMessage("사용 가능한 비밀번호입니다.");
      } else {
        setPasswordSuccessMessage("");
      }
    }
  };

  /**
   *   TODO:  event handler: 비밀번호 확인 변경 이벤트 처리
   */
  const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPasswordCheck(value);

    if (value === "") {
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage("");
      setPasswordCheckSuccessMessage("");
    } else if (value !== password) {
      setPasswordCheckError(true);
      setPasswordCheckErrorMessage("비밀번호가 일치하지 않습니다.");
      setPasswordCheckSuccessMessage("");
    } else {
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage("");
      setPasswordCheckSuccessMessage("비밀번호가 일치합니다.");
    }
  };

  /**
   *   TODO:  event handler: 아이디 변경 이벤트 처리
   */
  const onUsernameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUsername(value);
  }

  /**
   *   TODO:  event handler: 핸드폰 변경 이벤트 처리
   */
  const onPhoneChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPhone(value);
  }

  /**
   *   TODO:  event handler: 주소 변경 이벤트 처리
   */
  const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAddress(value);
  }

  /**
   *   TODO:  event handler: 상세 주소 변경 이벤트 처리
   */
  const onAddressDetailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAddressDetail(value);
  }

  /**
   *   TODO:  event handler: 비밀번호 버튼 클릭 이벤트 처리
   */
  const onPasswordButtonClickHandler = () => {
    if (passwordButtonIcon === 'eye-light-off-icon') {
      setPasswordButtonIcon('eye-light-on-icon');
      setPasswordType('text');
    } else {
      setPasswordButtonIcon('eye-light-off-icon');
      setPasswordType('password');
    }
  };

  /**
   *   TODO:  event handler: 비밀번호 확인 버튼 클릭 이벤트 처리
   */
  const onPasswordCheckButtonClickHandler = () => {
    if (passwordCheckButtonIcon === 'eye-light-off-icon') {
      setPasswordCheckButtonIcon('eye-light-on-icon');
      setPasswordCheckType('text');
    } else {
      setPasswordCheckButtonIcon('eye-light-off-icon');
      setPasswordCheckType('password');
    }
  };

  /**
   *   TODO:  event handler: 회원가입 버튼 클릭 이벤트 처리
   */
  const onSignUpButtonClickHandler = () => {
    let isFormValid = true;

    // 이메일 검증
    const isEmailValid = validateEmail(email).isValid;
    if (!email || !isEmailValid) {
      setEmailError(true);
      setEmailErrorMessage(email ? "올바른 이메일 형식을 입력해주세요." : "이메일을 입력해주세요.");
      isFormValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // 비밀번호 검증
    const isPasswordValid = validatePassword(password).isValid;
    if (!password || !isPasswordValid) {
      setPasswordError(true);
      setPasswordErrorMessage(password ? "비밀번호는 8자 이상 20자 이하이어야 하며 숫자, 소문자, 대문자를 포함해야 합니다." : "비밀번호를 입력해주세요.");
      isFormValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    // 비밀번호 확인 검증
    const isPasswordCheckValid = passwordCheck === password;
    if (!passwordCheck || !isPasswordCheckValid) {
      setPasswordCheckError(true);
      setPasswordCheckErrorMessage(passwordCheck ? "비밀번호가 일치하지 않습니다." : "비밀번호 확인을 입력해주세요.");
      isFormValid = false;
    } else {
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage("");
    }

    // 모든 입력이 유효하면 처리
    if (isFormValid) {
      alert("회원가입이 완료되었습니다.");
      setPage(1);
    }
  };



  /**
   *   TODO:  render: 회원가입 컴포넌트 렌더링
   */
  return (
    <div className="auth-card">
      <div className='auth-card-box'>
        <div className='auth-card-top'>
          <div className='auth-card-title-box'>
            <div className='auth-card-title'>{'회원가입'}</div>
            <div className='auth-card-page'>{`${page}/2`}</div>
          </div>
          <InputBox ref={emailRef} label='이메일*' type='text'
                    placeholder='이메일 주소를 입력해주세요.' value={email} onChange={onEmailChangeHandler}
                    error={isEmailError} message={emailErrorMessage} successMessage={emailSuccessMessage} />

          <InputBox ref={passwordRef} label='비밀번호*' type={passwordType}
                    placeholder='비밀번호를 입력해주세요.' value={password} onChange={onPasswordChangeHandler}
                    error={isPassword} message={passwordErrorMessage} successMessage={passwordSuccessMessage}
                    icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler}/>

          <InputBox ref={passwordCheckRef} label='비밀번호 확인*' type={passwordCheckType}
                    placeholder='비밀번호를 다시 입력해주세요.' value={passwordCheck} onChange={onPasswordCheckChangeHandler}
                    error={isPasswordCheckError} message={passwordCheckErrorMessage} successMessage={passwordCheckSuccessMessage}
                    icon={passwordCheckButtonIcon} onButtonClick={onPasswordCheckButtonClickHandler}/>

          <InputBox ref={usernameRef} label='아이디*' type='text'
                    placeholder='아이디를 입력해주세요.' value={username} onChange={onUsernameChangeHandler}
                    error={isUsernameError} message={usernameErrorMessage} />

          <InputBox ref={phoneRef} label='핸드폰 번호*' type='text'
                    placeholder='핸드폰 번호를 입력해주세요.' value={phone} onChange={onPhoneChangeHandler}
                    error={isPhoneError} message={phoneErrorMessage} />

          <InputBox ref={addressRef} label='주소*' type='text'
                    placeholder='주소를 입력해주세요.' value={address} onChange={onAddressChangeHandler}
                    error={isAddressError} message={addressErrorMessage} />

          <InputBox ref={addressDetailRef} label='상세 주소*' type='text'
                    placeholder='상세 주소를 입력해주세요.' value={addressDetail} onChange={onAddressDetailChangeHandler}
                    error={isAddressDetailError} message={addressDetailErrorMessage} />
        </div>

        <div className='auth-consent-box'>
          <div className='auth-check-box'>
            <div className='check-round-light-icon'></div>
          </div>
          <div className='auth-consent-title'>{'개인정보동의'}</div>
          <div className='auth-consent-link'>{'더보기 >'}</div>
        </div>

        <div className="auth-card-bottom">
          <div className="auth-button" onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
        </div>
      </div>
    </div>
  );
}


