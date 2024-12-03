import './style.css';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import InputBox from 'components/InputBox';
import { SignInRequestDto } from 'apis/request/auth';
import {
  checkEmailExists,
  checkUsernameExists,
  resendVerificationCode,
  sendVerificationCode,
  signInRequest,
  signUpRequest, verifyCode,
} from 'apis';
import { ApiResponseDto } from 'apis/response';
import { SignInResponseDto } from 'apis/response/auth';
import { useCookies } from 'react-cookie';
import { MAIN_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { SignUpRequestDto } from 'apis/request/auth';
import { SignUpResponseDto } from 'apis/response/auth';

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
   *   TODO:  funtion: navitate 함수
   */
  const navigator = useNavigate();

  /**
   *   TODO:  state: 요소 참조 상태
   */
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const passwordRef = useRef<HTMLInputElement | null>(null);

  /**
   *   TODO:  state: 상태
   */
  const [cookie, setCookie] = useCookies();

  const [username, setUsername] = useState<string>('');

  const [password, setPassword] = useState<string>('');

  const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');

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
    const savedUsername = localStorage.getItem('savedEmail');
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
   *   TODO:  event handler: 인풋 키 다운 이벤트 처리
   */
  const onUsernameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!passwordRef.current) return;
    passwordRef.current.focus();
  };

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
  /**
   *   TODO:  funtion: navitate 함수
   */
  const navigator = useNavigate();

  /**
   *   TODO:  state: 요소 참조 상태
   */
  const emailRef = useRef<HTMLInputElement | null>(null);

  const verificationCodeRef = useRef<HTMLInputElement | null>(null);

  const passwordRef = useRef<HTMLInputElement | null>(null);

  const passwordCheckRef = useRef<HTMLInputElement | null>(null);

  const usernameRef = useRef<HTMLInputElement | null>(null);

  const phoneRef = useRef<HTMLInputElement | null>(null);

  const zonecodeRef = useRef<HTMLInputElement | null>(null);

  const addressRef = useRef<HTMLInputElement | null>(null);

  const addressDetailRef = useRef<HTMLInputElement | null>(null);

  /**
   *   TODO:  state: 상태
   */

  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

  const [page, setPage] = useState<1 | 2>(1);

  const [email, setEmail] = useState<string>('');

  const [verificationCode, setVerificationCode] = useState<string>('');

  const [password, setPassword] = useState<string>('');

  const [passwordCheck, setPasswordCheck] = useState<string>('');

  const [username, setUsername] = useState<string>('');

  const [phone, setPhone] = useState<string>('');

  const [zonecode, setZonecode] = useState<string>('');

  const [address, setAddress] = useState<string>('');

  const [addressDetail, setAddressDetail] = useState<string>('');

  const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);

  const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');

  const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');

  /**
   *   TODO:  state: 에러 상태
   */
  const [isEmailError, setEmailError] = useState<boolean>(false);

  const [isVerificationCodeError, setVerificationCodeError] = useState<boolean>(false);

  const [isPassword, setPasswordError] = useState<boolean>(false);

  const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);

  const [isUsernameError, setUsernameError] = useState<boolean>(false);

  const [isPhoneError, setPhoneError] = useState<boolean>(false);

  const [isZonecodeError, setZonecodeError] = useState<boolean>(false);

  const [isAddressError, setAddressError] = useState<boolean>(false);

  const [isAddressDetailError, setAddressDetailError] = useState<boolean>(false);

  const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);

  /**
   *   TODO:  state: 성공 메시지 상태
   */
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string>('');

  const [verificationCodeSuccessMessage, setVerificationCodeSuccessMessage] = useState<string>('');

  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<string>('');

  const [passwordCheckSuccessMessage, setPasswordCheckSuccessMessage] = useState<string>('');

  const [usernameSuccessMessage, setUsernameSuccessMessage] = useState<string>('');

  const [phoneSuccessMessage, setPhoneSuccessMessage] = useState<string>('');

  /**
   *   TODO:  state: 에러 메시지 상태
   */
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');

  const [verificationCodeErrorMessage, setVerificationCodeErrorMessage] = useState<string>('');

  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');

  const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');

  const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>('');

  const [phoneErrorMessage, setPhoneErrorMessage] = useState<string>('');

  const [zonecodeErrorMessage, setZonecodeErrorMessage] = useState<string>('');

  const [addressErrorMessage, setAddressErrorMessage] = useState<string>('');

  const [addressDetailErrorMessage, setAddressDetailErrorMessage] = useState<string>('');

  /**
   *   TODO:  state: 버튼 아이콘 상태
   */
  const [emailButtonIcon, setEmailButtonIcon] = useState<'email-gray-icon' | 'email-send-icon' | 'email-resend-icon'>('email-gray-icon');

  const [emailCheckButtonIcon, setEmailCheckButtonIcon] = useState<'auth-icon' | undefined>('auth-icon');

  const [usernameButtonIcon, setUsernameButtonIcon] = useState<'person-icon' | undefined>('person-icon');

  const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

  const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

  const [addressButtonIcon, setAddressButtonIcon] = useState<'home-gray-icon' | undefined>('home-gray-icon');

  /**
   *   TODO:  function:  다음 주소 검색 팝업 오픈 함수
   */
  const open = useDaumPostcodePopup();

  /**
   *   TODO:  function:  회원가입 response 처리 함수
   */
  const signUpResponse = (responseBody: SignUpResponseDto | ApiResponseDto | null) => {
    if (!responseBody) {
      alert('네트워크 이상입니다.');
      return;
    }

    console.log(responseBody);

    const {code} = responseBody;

    console.log('Response Code:', code);

    if (code === 'DE') {
      setPage(1);
      setEmailError(true);
      setEmailErrorMessage('중복되는 이메일입니다.');
      return;
    }
    if (code === 'DU') {
      setPage(1);
      setUsernameError(true);
      setEmailErrorMessage('중복되는 아이디입니다.');
      return;
    }
    // if (code === 'DP') {
    //   setPage(2);
    //   setPhoneError(true);
    //   setPhoneErrorMessage('중복되는 핸드폰 번호입니다.');
    //   return;
    // }
    if (code === 'VF') {
      alert('모든 값을 입력하세요.');
      return;
    }
    if (code === 'DBE') {
      alert('데이터베이스 오류입니다.');
      return;
    }
    if (code === 'SU') {
      alert("회원가입이 완료되었습니다.");
      navigator("/");
      setView('sign-in');
    }
  }

  /**
   *   TODO:  function:  유효성 검사 함수
   */
  const validateEmail = (email: string): { isValid: boolean; errorMessage: string } => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return {
        isValid: false,
        errorMessage: '올바른 이메일 형식을 입력해주세요.'
      };
    }
    return {
      isValid: true,
      errorMessage: ''
    };
  };

  const validatePassword = (password: string): { isValid: boolean; errorMessage: string } => {
    const trimmedPassword = password.trim();

    if (trimmedPassword.length < 8 || trimmedPassword.length > 20) {
      return {
        isValid: false,
        errorMessage: '비밀번호는 8자 이상 20자 이하이어야 합니다.'
      };
    }

    const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
    if (!passwordPattern.test(trimmedPassword)) {
      return {
        isValid: false,
        errorMessage: '비밀번호는 숫자, 소문자, 대문자, 특수문자를 각각 하나 이상 포함해야 합니다.'
      };
    }

    return {
      isValid: true,
      errorMessage: ''
    };
  };

  /**
   *   TODO:  event handler: 변경 이벤트 처리
   */
  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);

    if (value === '') {
      setEmailError(false);
      setEmailErrorMessage('');
      setEmailSuccessMessage('');
    } else {
      const { isValid, errorMessage } = validateEmail(value);
      setEmailError(!isValid);
      setEmailErrorMessage(errorMessage);

      if (isValid) {
        setEmailSuccessMessage('이메일 중복 인증을 해주세요.');
      } else {
        setEmailSuccessMessage('');
      }
    }
  };

  const onVerificationCodeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setVerificationCode(value);

    const isValidCode = /^[0-9]{4}$/.test(value);

    if (value === '') {
      setVerificationCodeError(false);
      setVerificationCodeErrorMessage('');
      setVerificationCodeSuccessMessage('');
    } else if (isValidCode) {
      setVerificationCodeError(false);
      setVerificationCodeErrorMessage('');
      setVerificationCodeSuccessMessage('인증번호를 인증해주세요.');
    } else {
      setVerificationCodeError(true);
      setVerificationCodeErrorMessage('인증번호는 4자리 숫자입니다.');
      setVerificationCodeSuccessMessage('');
    }
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);

    if (value === '') {
      setPasswordError(false);
      setPasswordErrorMessage('');
      setPasswordSuccessMessage('');
    } else {
      const { isValid, errorMessage } = validatePassword(value);
      setPasswordError(!isValid);
      setPasswordErrorMessage(errorMessage);

      if (isValid) {
        setPasswordSuccessMessage('사용 가능한 비밀번호입니다.');
      } else {
        setPasswordSuccessMessage('');
      }
    }
  };

  const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPasswordCheck(value);

    if (value === '') {
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage('');
      setPasswordCheckSuccessMessage('');
    } else if (value !== password) {
      setPasswordCheckError(true);
      setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
      setPasswordCheckSuccessMessage('');
    } else {
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage('');
      setPasswordCheckSuccessMessage('비밀번호가 일치합니다.');
    }
  };

  const onUsernameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUsername(value);

    if (value === '') {
      setUsernameError(false);
      setUsernameErrorMessage('');
      setUsernameSuccessMessage('');
    } else if (value.length < 3 || value.length > 10) {
      setUsernameError(true);
      setUsernameErrorMessage('아이디는 3자 이상, 10자 이하로 입력해주세요.');
      setUsernameSuccessMessage('');
    } else {
      setUsernameError(false);
      setUsernameErrorMessage('');
      setUsernameSuccessMessage('아이디 중복 인증을 해주세요.');
    }
  };

  const onPhoneChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPhone(value);

    const phoneValid = /^010\d{4}\d{4}$/;

    if (value === '') {
      setPhoneError(false);
      setPhoneErrorMessage('');
      setPhoneSuccessMessage('');
    } else if (!phoneValid.test(value)) {
      setPhoneError(true);
      setPhoneErrorMessage('올바른 핸드폰 번호 형식으로 입력해주세요.');
      setUsernameSuccessMessage('');
    } else {
      setPhoneError(false);
      setPhoneErrorMessage('');
      setPhoneSuccessMessage('사용 가능한 핸드폰 번호입니다.')
    }
  };

  const onZonecodeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setZonecode(value);
    setZonecodeError(false);
    setZonecodeErrorMessage('주소를 입력 바랍니다.');
  }

  const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAddress(value);
    setAddressError(false);
    setAddressErrorMessage('주소를 입력 바랍니다.');
  };

  const onAddressDetailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAddressDetail(value);
    setAddressDetailError(false);
    setAddressDetailErrorMessage('상세 주소를 입력 바랍니다.');
  };

  /**
   *   TODO:  event handler:  버튼 클릭 이벤트 처리
   */
  const onAgreedPersonalClickHandler = () => {
    setAgreedPersonal(!agreedPersonal);
    setAgreedPersonalError(false);
  };

  const onEmailButtonClickHandler = async () => {
    if (emailButtonIcon === 'email-gray-icon') {
      // 이메일 중복 체크
      const response = await checkEmailExists(email);

      if (response && response.code === 'DE') {
        setEmailError(true);
        setEmailErrorMessage('중복되는 이메일입니다.');
      } else if (response && response.code === 'SU') {
        setEmailError(false);
        setEmailErrorMessage('');
        setEmailSuccessMessage('사용 가능한 이메일입니다.');

        // 이메일이 사용 가능하면 인증 코드 발송
        const sendCodeResponse = await sendVerificationCode(email);
        if (sendCodeResponse && sendCodeResponse.code === 'SU') {
          alert('인증 코드가 발송되었습니다.');
          setEmailButtonIcon('email-send-icon');  // 발송 후 재발송 아이콘으로 변경
        } else {
          alert('인증 코드 발송에 실패했습니다.');
        }
      } else {
        alert('이메일 중복 체크에 실패했습니다.');
      }
    } else if (emailButtonIcon === 'email-send-icon') {
      // 인증 코드 발송
      const sendCodeResponse = await sendVerificationCode(email);
      if (sendCodeResponse && sendCodeResponse.code === 'SU') {
        alert('인증 코드가 발송되었습니다.');
        setEmailButtonIcon('email-resend-icon');  // 발송 후 재발송 아이콘으로 변경
      } else {
        alert('인증 코드 발송에 실패했습니다.');
      }
    } else if (emailButtonIcon === 'email-resend-icon') {
      // 인증 코드 재발송
      const resendResponse = await resendVerificationCode(email);
      if (resendResponse && resendResponse.code === 'SU') {
        alert('인증 코드가 재발송되었습니다.');
      } else {
        alert('인증 코드 재발송에 실패했습니다.');
      }
    }
  };

  const onEmailCheckButtonClickHandler = async () => {
    console.log("Email:", email);
    console.log("Verification Code:", verificationCode);

    const response = await verifyCode(email, verificationCode);

    if (response && response.code === 'SU') {
      setVerificationCodeError(false);
      setVerificationCodeErrorMessage('');
      setVerificationCodeSuccessMessage('인증이 완료되었습니다.');
      // 인증 코드 검증 후 성공 처리 (예: 상태 업데이트, 화면 전환 등)
    } else if (response && response.code === 'IE') {
      setVerificationCodeError(true);
      setVerificationCodeErrorMessage('');
      setVerificationCodeErrorMessage('유효하지 않은 이메일입니다.');
    } else if (response && response.code === 'EVC') {
      setVerificationCodeError(true);
      setVerificationCodeErrorMessage('');
      setVerificationCodeErrorMessage('인증 코드가 만료되었습니다.');
    } else if (response && response.code === 'IVC') {
      setVerificationCodeError(true);
      setVerificationCodeErrorMessage('');
      setVerificationCodeErrorMessage('인증 코드가 정확하지 않습니다.');
    } else {
      // 검증 요청 실패
      alert('인증 코드 검증에 실패했습니다.');
    }
  };

  const onUsernameButtonClickHandler = async () => {

    const response = await checkUsernameExists(username);

    if (response && response.code === 'DU') {
      setUsernameError(true);
      setUsernameErrorMessage('중복되는 아이디입니다.');
    } else if (response && response.code === 'SU') {
      setUsernameError(false);
      setUsernameErrorMessage('');
      setUsernameSuccessMessage('사용 가능한 아이디입니다.');
    } else {
      alert('아이디 중복 체크에 실패했습니다.');
    }
  };

  const onPasswordButtonClickHandler = () => {
    if (passwordButtonIcon === 'eye-light-off-icon') {
      setPasswordButtonIcon('eye-light-on-icon');
      setPasswordType('text');
    } else {
      setPasswordButtonIcon('eye-light-off-icon');
      setPasswordType('password');
    }
  };

  const onPasswordCheckButtonClickHandler = () => {
    if (passwordCheckButtonIcon === 'eye-light-off-icon') {
      setPasswordCheckButtonIcon('eye-light-on-icon');
      setPasswordCheckType('text');
    } else {
      setPasswordCheckButtonIcon('eye-light-off-icon');
      setPasswordCheckType('password');
    }
  };

  const onAddressButtonClickHandler = () => {
    open({onComplete});
  };

  const onNextButtonClickHandler = () => {
    let isFormValid1 = true;

    // 이메일 검증
    const isEmailValid1 = validateEmail(email).isValid;
    if (!email || email.trim().length === 0 || !isEmailValid1) {
      setEmailError(true);
      setEmailErrorMessage(email ? "올바른 이메일 형식을 입력해주세요." : "이메일을 입력해주세요.");
      isFormValid1 = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // 아이디 검증
    if (!username || username.trim().length === 0 || username.length < 3 || username.length > 10) {
      setUsernameError(true);
      setUsernameErrorMessage(username ? "아이디는 3자 이상, 10자 이하로 입력해주세요." : "아이디를 입력해주세요.");
      isFormValid1 = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    // 비밀번호 검증
    const isPasswordValid = validatePassword(password).isValid;
    if (!password || password.trim().length === 0 || !isPasswordValid) {
      setPasswordError(true);
      setPasswordErrorMessage(password ? "비밀번호는 8자 이상 20자 이하이어야 하며 숫자, 소문자, 대문자를 포함해야 합니다." : "비밀번호를 입력해주세요.");
      isFormValid1 = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    // 비밀번호 확인 검증
    const isPasswordCheckValid = passwordCheck === password;
    if (!passwordCheck || passwordCheck.trim().length === 0 || !isPasswordCheckValid) {
      setPasswordCheckError(true);
      setPasswordCheckErrorMessage(passwordCheck ? "비밀번호가 일치하지 않습니다." : "비밀번호 확인을 입력해주세요.");
      isFormValid1 = false;
    } else {
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage("");
    }

    if (isFormValid1) {
      setPage(2);
      setTimeout(() => {
        phoneRef.current?.focus();
      }, 0);
    }
  };

  /**
   *   TODO:  event handler: 다음 주소 검색 완료 이벤트 처리
   */
  const onComplete = (data:Address) => {
    const {zonecode, address} = data;
    setZonecode(zonecode);
    setAddress(address);
    if (!addressDetailRef.current) return;
    addressDetailRef.current.focus();
  }

  /**
   *   TODO:  event handler: 회원가입 버튼 클릭 이벤트 처리
   */
  const onSignUpButtonClickHandler = () => {
    let isFormValid = true;

    // 이메일 검증
    const isEmailValid = validateEmail(email).isValid;
    if (!email || email.trim().length === 0 || !isEmailValid) {
      setEmailError(true);
      setEmailErrorMessage(email ? "올바른 이메일 형식을 입력해주세요." : "이메일을 입력해주세요.");
      isFormValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // 인증코드 검증
    if (!verificationCode || verificationCode.trim().length === 0 || verificationCode.length > 4) {
      setVerificationCodeError(true);
      setVerificationCodeErrorMessage(verificationCode ? "4자리 숫자로 입력해주세요." : "인증번호를 입력해주세요.");
      isFormValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    // 아이디 검증
    if (!username || username.trim().length === 0 || username.length < 3 || username.length > 10) {
      setUsernameError(true);
      setUsernameErrorMessage(username ? "아이디는 3자 이상, 10자 이하로 입력해주세요." : "아이디를 입력해주세요.");
      isFormValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    // 비밀번호 검증
    const isPasswordValid = validatePassword(password).isValid;
    if (!password || password.trim().length === 0 || !isPasswordValid) {
      setPasswordError(true);
      setPasswordErrorMessage(password ? "비밀번호는 8자 이상 20자 이하이어야 하며 숫자, 소문자, 대문자를 포함해야 합니다." : "비밀번호를 입력해주세요.");
      isFormValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    // 비밀번호 확인 검증
    const isPasswordCheckValid = passwordCheck === password;
    if (!passwordCheck || passwordCheck.trim().length === 0 || !isPasswordCheckValid) {
      setPasswordCheckError(true);
      setPasswordCheckErrorMessage(passwordCheck ? "비밀번호가 일치하지 않습니다." : "비밀번호 확인을 입력해주세요.");
      isFormValid = false;
    } else {
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage("");
    }

    // 핸드폰 번호 검증
    const phoneValid = /^010\d{4}\d{4}$/;
    if (!phone || phone.trim().length === 0 || !phoneValid.test(phone)) {
      setPhoneError(true);
      setPhoneErrorMessage(phone ? "올바른 핸드폰 번호 형식으로 입력해주세요." : "핸드폰 번호를 입력해주세요.");
      isFormValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage("");
    }

    // 우편번호 검증
    if (!zonecode || zonecode.trim().length === 0) {
      setAddressError(true);
      setAddressErrorMessage("주소를 입력해주세요.");
      isFormValid = false;
    } else {
      setZonecodeError(false);
      setZonecodeErrorMessage("");
    }

    // 주소 검증
    if (!address || address.trim().length === 0) {
      setAddressError(true);
      setAddressErrorMessage("주소를 입력해주세요.");
      isFormValid = false;
    } else {
      setAddressError(false);
      setAddressErrorMessage("");
    }

    // 상세 주소 검증
    if (!addressDetail || addressDetail.trim().length === 0) {
      setAddressDetailError(true);
      setAddressDetailErrorMessage("상세 주소를 입력해주세요.");
      isFormValid = false;
    } else {
      setAddressDetailError(false);
      setAddressDetailErrorMessage("");
    }

    // 개인 정보 동의 검증
    if (!agreedPersonal) {
      setAgreedPersonalError(true);
      isFormValid = false;
    } else {
      setAgreedPersonalError(false);
    }

    // 모든 입력이 유효하면 처리
    if (isFormValid) {
      const requestBody: SignUpRequestDto = {
        email, verificationCode, username, password, passwordCheck, phone, zonecode, address, addressDetail, agreedPersonal
      };

      signUpRequest(requestBody).then(signUpResponse);
    } else {
      alert("회원가입이 완료되었습니다.");
    }
  };

  /**
   *   TODO:  event handler: 인풋 키 다운 이벤트 처리
   */
  const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!passwordCheckRef.current) return;
    passwordCheckRef.current.focus();
  };

  const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onNextButtonClickHandler();
  };

  const onAddressDetailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onSignUpButtonClickHandler();
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
          {page === 1 && (
            <>
              <InputBox ref={emailRef} label='이메일*' type='text'
                        placeholder='이메일 주소를 입력해주세요.' value={email} onChange={onEmailChangeHandler}
                        error={isEmailError} message={emailErrorMessage} successMessage={emailSuccessMessage}
                        icon={emailButtonIcon} onButtonClick={onEmailButtonClickHandler} />

              <InputBox ref={verificationCodeRef} label='인증번호*' type='text'
                        placeholder='인증번호를 입력해주세요.' value={verificationCode} onChange={onVerificationCodeChangeHandler}
                        error={isVerificationCodeError} message={verificationCodeErrorMessage} successMessage={verificationCodeSuccessMessage}
                        icon={emailCheckButtonIcon} onButtonClick={onEmailCheckButtonClickHandler} />

              <InputBox ref={usernameRef} label='아이디*' type='text'
                        placeholder='아이디를 입력해주세요.' value={username} onChange={onUsernameChangeHandler}
                        error={isUsernameError} message={usernameErrorMessage} successMessage={usernameSuccessMessage} 
                        icon={usernameButtonIcon} onButtonClick={onUsernameButtonClickHandler}/>

              <InputBox ref={passwordRef} label='비밀번호*' type={passwordType}
                        placeholder='비밀번호를 입력해주세요.' value={password} onChange={onPasswordChangeHandler}
                        error={isPassword} message={passwordErrorMessage} successMessage={passwordSuccessMessage}
                        icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler}/>

              <InputBox ref={passwordCheckRef} label='비밀번호 확인*' type={passwordCheckType}
                        placeholder='비밀번호를 다시 입력해주세요.' value={passwordCheck} onChange={onPasswordCheckChangeHandler}
                        error={isPasswordCheckError} message={passwordCheckErrorMessage} successMessage={passwordCheckSuccessMessage}
                        icon={passwordCheckButtonIcon} onButtonClick={onPasswordCheckButtonClickHandler} onKeyDown={onPasswordCheckKeyDownHandler}/>
            </>
          )}
          {page === 2 && (
            <>
              <InputBox ref={phoneRef} label='핸드폰 번호*' type='text'
                        placeholder='핸드폰 번호를 입력해주세요.' value={phone} onChange={onPhoneChangeHandler}
                        error={isPhoneError} message={phoneErrorMessage} successMessage={phoneSuccessMessage} />

              <InputBox ref={zonecodeRef} label='우편번호*' type='text'
                        placeholder='주소 찾기' value={zonecode} onChange={onZonecodeChangeHandler}
                        error={isZonecodeError} message={zonecodeErrorMessage} icon={addressButtonIcon}
                        onButtonClick={onAddressButtonClickHandler} />

              <InputBox ref={addressRef} label='주소*' type='text'
                        placeholder='주소를 입력해주세요.' value={address} onChange={onAddressChangeHandler}
                        error={isAddressError} message={addressErrorMessage} />

              <InputBox ref={addressDetailRef} label='상세 주소*' type='text'
                        placeholder='상세 주소를 입력해주세요.' value={addressDetail} onChange={onAddressDetailChangeHandler}
                        error={isAddressDetailError} message={addressDetailErrorMessage} onKeyDown={onAddressDetailKeyDownHandler} />
            </>
          )}
        </div>

        <div className="auth-card-bottom">
          {page === 1 && (
            <div className="auth-button" onClick={onNextButtonClickHandler}>{'다음단계'}</div>
          )}

          {page === 2 && (
            <>
              <div className='auth-consent-box'>
                <div className='auth-check-box' onClick={onAgreedPersonalClickHandler}>
                  <div className={`icon ${agreedPersonal ? 'check-round-fill-icon' : 'check-round-light-icon'}`}></div>
                </div>
                <div
                  className={isAgreedPersonalError ? 'auth-consent-title-error' : 'auth-consent-title'}>{'개인정보동의'}</div>
                <div className='auth-consent-link'>{'더보기 >'}</div>
              </div>

              <div className="auth-button" onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}


