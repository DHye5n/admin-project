import React, { ChangeEvent, useRef, useState } from 'react';
import InputBox from '../InputBox';
import './style.css';
import { existUsernameCheck, findPasswordRequest, findUsernameRequest, sendVerificationCode, verifyCode } from 'apis';

function FindForm({ mode }: { mode: 'findPassword' | 'findUsername' | 'updatePassword' | 'updateUsername' }) {
  /**
   *   TODO:  state: 요소 참조 상태
   */
  const emailRef = useRef<HTMLInputElement | null>(null);
  const verificationCodeRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);

  /**
   *   TODO:  state: 상태
   */
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSuccessMessage, setIsSuccessMessage] = useState('');

  /**
   *   TODO:  state: 에러 상태
   */
  const [isEmailError, setEmailError] = useState(false);
  const [isVerificationCodeError, setVerificationCodeError] = useState<boolean>(false);
  const [isUsernameError, setUsernameError] = useState<boolean>(false);

  /**
   *   TODO:  state: 성공 메시지 상태
   */
  const [emailSuccessMessage, setEmailSuccessMessage] = useState('');
  const [verificationCodeSuccessMessage, setVerificationCodeSuccessMessage] = useState<string>('');
  const [usernameSuccessMessage, setUsernameSuccessMessage] = useState<string>('');

  /**
   *   TODO:  state: 에러 메시지 상태
   */
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [verificationCodeErrorMessage, setVerificationCodeErrorMessage] = useState<string>('');
  const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>('');

  /**
   *   TODO:  state: 버튼 아이콘 상태
   */
  const [emailButtonIcon, setEmailButtonIcon] = useState<'email' | 'emailError' | 'emailSuccess'>('email');
  const [emailCheckButtonIcon, setEmailCheckButtonIcon] = useState<'shield' | 'shieldError' | 'shieldSuccess'>('shield');
  const [usernameButtonIcon, setUsernameButtonIcon] = useState<'person' | 'personError' | 'personSuccess'>('person');

  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);

    if (!value) {
      setEmailError(true);
      setEmailErrorMessage('이메일을 입력해주세요.');
      setEmailSuccessMessage('');
      setEmailButtonIcon('emailError');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError(true);
      setEmailErrorMessage('유효한 이메일 주소를 입력하세요.');
      setEmailSuccessMessage('');
      setEmailButtonIcon('emailError');
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
      setEmailSuccessMessage('유효한 이메일 형식입니다.');
      setEmailButtonIcon('emailSuccess');
    }
  };

  const onUsernameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setUsernameError(false);
    setUsernameErrorMessage('');
    setUsernameSuccessMessage('');
  };

  const onEmailButtonClickHandler = async () => {
    if (!email) {
      setEmailError(true);
      setEmailErrorMessage('이메일을 입력해주세요.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('유효한 이메일 주소를 입력하세요.');
    } else {
      setEmailError(false);
      setEmailSuccessMessage('이메일이 확인되었습니다.');
      const response = await sendVerificationCode(email);

      if (response?.code === 'SU') {
        alert('인증코드가 발송되었습니다.');
      } else {
        alert('인증코드 발송에 실패했습니다. 다시 시도해주세요.');
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
      setEmailCheckButtonIcon('shield');
    } else if (isValidCode) {
      setVerificationCodeError(false);
      setVerificationCodeErrorMessage('');
      setVerificationCodeSuccessMessage('인증번호를 인증해주세요.');
    } else {
      setVerificationCodeError(true);
      setVerificationCodeErrorMessage('인증번호는 4자리 숫자입니다.');
      setVerificationCodeSuccessMessage('');
      setEmailCheckButtonIcon('shieldError');
    }
  };

  const onEmailCheckButtonClickHandler = async () => {

    const response = await verifyCode(email, verificationCode);

    if (!verificationCode) {
      alert('인증코드를 입력해주세요.');
      setVerificationCodeError(true);
      setVerificationCodeErrorMessage('인증코드를 입력해주세요.');
      setVerificationCodeSuccessMessage('');
      setEmailCheckButtonIcon('shieldError');
      return;
    }

    if (response && response.code === 'SU') {
      setVerificationCodeError(false);
      setVerificationCodeErrorMessage('');
      setVerificationCodeSuccessMessage('인증이 완료되었습니다.');
      setEmailCheckButtonIcon('shieldSuccess');
    } else if (response && response.code === 'IE') {
      setVerificationCodeError(true);
      setVerificationCodeErrorMessage('');
      setVerificationCodeErrorMessage('유효하지 않은 인증코드입니다..');
      setEmailCheckButtonIcon('shieldError');
    } else if (response && response.code === 'EVC') {
      setVerificationCodeError(true);
      setVerificationCodeErrorMessage('');
      setVerificationCodeErrorMessage('인증 코드가 만료되었습니다.');
      setEmailCheckButtonIcon('shieldError');
    } else if (response && response.code === 'IVC') {
      setVerificationCodeError(true);
      setVerificationCodeErrorMessage('');
      setVerificationCodeErrorMessage('인증 코드가 정확하지 않습니다.');
      setEmailCheckButtonIcon('shieldError');
    } else {
      // 검증 요청 실패
      alert('인증 코드 검증에 실패했습니다.');
    }
  };

  const onUsernameButtonClickHandler = async () => {

    const response = await existUsernameCheck(username);

    console.log('response', response);

    if (!username) {
      alert('아이디를 입력해주세요.');
      setUsernameError(true);
      setUsernameErrorMessage('아이디를 입력해주세요.');
      setUsernameSuccessMessage('');
      setUsernameButtonIcon('personError');
      return;
    }

    if (response && response.code === 'NEU') {
      setUsernameError(true);
      setUsernameErrorMessage('존재하지 않는 아이디입니다.');
      setUsernameButtonIcon('personError');
    } else if (response && response.code === 'SU') {
      setUsernameError(false);
      setUsernameErrorMessage('');
      setUsernameSuccessMessage('아이디가 확인되었습니다.');
      setUsernameButtonIcon('personSuccess');
    } else {
      alert('아이디 확인 중 오류가 발생했습니다.');
    }
  };

  const onFindPasswordHandler = async () => {
    if (!email || !username || !verificationCode) {
      alert('이메일, 사용자 이름, 인증 코드를 입력해주세요.');
      return;
    }

    const response = await findPasswordRequest(email, username, verificationCode);

    if (response?.success) {
      setIsSuccessMessage('임시 비밀번호가 이메일로 전송되었습니다. 로그인 후 비밀번호를 변경해주세요.');
      setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    } else if (response?.message) {
      alert(response.message);
    } else {
      alert('비밀번호 찾기 요청 중 오류가 발생했습니다.');
    }
  };

  const onFindUsernameHandler = async () => {
    if (!email || !verificationCode) {
      alert('이메일, 인증 코드를 입력해주세요.');
      return;
    }

    const response = await findUsernameRequest(email, verificationCode);

    if (response?.success) {
      setIsSuccessMessage('아이디가 이메일로 전송되었습니다. 이메일에 로그인하여 확인해주시기 바랍니다.');
      setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    } else if (response?.message) {
      alert(response.message);
    } else {
      alert('아이디 찾기 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='modal-content-body-input-box'>
      {isSuccessMessage ? (
        // ✅ 성공 메시지 (mode에 따라 다르게 출력)
        <div className='modal-content-body-success-text'>
          {mode === 'findUsername' ? (
            <>아이디가 이메일로 전송되었습니다.</>
          ) : (
            <>임시 비밀번호가 이메일로 전송되었습니다. <span>* 로그인 후 비밀번호를 꼭 변경해주세요. *</span></>
          )}
        </div>
      ) : (
        mode === 'findUsername' ? (
          // ✅ 아이디 찾기 폼
          <>
            <InputBox
              ref={emailRef}
              label='이메일*'
              type='text'
              placeholder='이메일 주소를 입력해주세요.'
              value={email}
              onChange={onEmailChangeHandler}
              error={isEmailError}
              message={emailErrorMessage}
              successMessage={emailSuccessMessage}
              icon={emailButtonIcon}
              onButtonClick={onEmailButtonClickHandler}
            />
            <InputBox
              ref={verificationCodeRef}
              label='인증코드*'
              type='text'
              placeholder='인증번호를 입력해주세요.'
              value={verificationCode}
              onChange={onVerificationCodeChangeHandler}
              error={isVerificationCodeError}
              message={verificationCodeErrorMessage}
              successMessage={verificationCodeSuccessMessage}
              icon={emailCheckButtonIcon}
              onButtonClick={onEmailCheckButtonClickHandler}
            />
            <div className='blue-button' onClick={onFindUsernameHandler}>아이디 찾기</div>
          </>
        ) : (
          // ✅ 비밀번호 찾기 폼
          <>
            <InputBox
              ref={emailRef}
              label='이메일*'
              type='text'
              placeholder='이메일 주소를 입력해주세요.'
              value={email}
              onChange={onEmailChangeHandler}
              error={isEmailError}
              message={emailErrorMessage}
              successMessage={emailSuccessMessage}
              icon={emailButtonIcon}
              onButtonClick={onEmailButtonClickHandler}
            />
            <InputBox
              ref={verificationCodeRef}
              label='인증코드*'
              type='text'
              placeholder='인증번호를 입력해주세요.'
              value={verificationCode}
              onChange={onVerificationCodeChangeHandler}
              error={isVerificationCodeError}
              message={verificationCodeErrorMessage}
              successMessage={verificationCodeSuccessMessage}
              icon={emailCheckButtonIcon}
              onButtonClick={onEmailCheckButtonClickHandler}
            />
            <InputBox
              ref={usernameRef}
              label='아이디*'
              type='text'
              placeholder='아이디를 입력해주세요.'
              value={username}
              onChange={onUsernameChangeHandler}
              error={isUsernameError}
              message={usernameErrorMessage}
              successMessage={usernameSuccessMessage}
              icon={usernameButtonIcon}
              onButtonClick={onUsernameButtonClickHandler}
            />
            <div className='blue-button' onClick={onFindPasswordHandler}>비밀번호 찾기</div>
          </>
        )
      )}
    </div>
  );

}

export default FindForm;