import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import InputBox from '../InputBox';
import './style.css';
import {
  patchPasswordRequest,
} from 'apis';
import { PatchPasswordRequestDto } from 'apis/request/user';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ApiResponseDto } from 'apis/response';
import { PatchPasswordResponseDto } from 'apis/response/user';
import { AUTH_PATH, MAIN_PATH, USER_PATH } from 'constant';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import useSignInUserStore from 'stores/login-user.store';

function UpdateForm({ mode, onClose }: { mode: 'findPassword' | 'findUsername' | 'updatePassword'; onClose: () => void }) {
  /**
   *   TODO:  state: 요소 참조 상태
   */
  const newPasswordRef = useRef<HTMLInputElement | null>(null);
  const newPasswordCheckRef = useRef<HTMLInputElement | null>(null);
  // const { userId } = useParams();
  const [cookie, setCookie] = useCookies();
  const navigator = useNavigate();
  const [isAlertShown, setIsAlertShown] = useState<boolean>(false);
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { signInUser } = useSignInUserStore();

  /**
   *   TODO:  state: 상태
   */
  const [newPassword, setNewPassword] = useState<string>('');

  const [newPasswordCheck, setNewPasswordCheck] = useState<string>('');

  const [newPasswordType, setNewPasswordType] = useState<'text' | 'password'>('password');

  const [newPasswordCheckType, setNewPasswordCheckType] = useState<'text' | 'password'>('password');

  /**
   *   TODO:  state: 에러 상태
   */
  const [isNewPasswordError, setNewPasswordError] = useState<boolean>(false);

  const [newPasswordCheckError, setNewPasswordCheckError] = useState<boolean>(false);

  /**
   *   TODO:  state: 성공 메시지 상태
   */
  const [isSuccessMessage, setIsSuccessMessage] = useState('');

  const [newPasswordSuccessMessage, setNewPasswordSuccessMessage] = useState<string>('');

  const [newPasswordCheckSuccessMessage, setNewPasswordCheckSuccessMessage] = useState<string>('');

  /**
   *   TODO:  state: 에러 메시지 상태
   */
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState<string>('');

  const [newPasswordCheckErrorMessage, setNewPasswordCheckErrorMessage] = useState<string>('');

  /**
   *   TODO:  state: 버튼 아이콘 상태
   */
  const [newPasswordButtonIcon, setNewPasswordButtonIcon] = useState<'eyeOff' | 'eyeOn'>('eyeOff');

  const [newPasswordCheckButtonIcon, setNewPasswordCheckButtonIcon] = useState<'eyeOff' | 'eyeOn'>('eyeOff');

  const handleApiError = useCallback((code: string) => {
    if (isAlertShown) return;
    setIsAlertShown(true);

    // alert 재실행 방지를 위한 3초 제한
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = setTimeout(() => setIsAlertShown(false), 3000);

    // 에러 처리
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
  }, [isAlertShown, navigator]);

  /**
   *   TODO:  response: response 처리 함수
   */
  const patchPasswordResponse = (responseBody: ApiResponseDto<PatchPasswordResponseDto> | null) => {
    console.log('비밀번호 변경 응답:', responseBody);

    if (!responseBody) return;

    const { code } = responseBody;
    console.log('응답 코드:', code);

    if (code === 'VF') {
      handleApiError(code);
      return;
    }

    alert('비밀번호 변경이 완료되었습니다.');
    if (!signInUser) return;

    const userId = signInUser.userId;

    console.log('페이지 이동 시작:', USER_PATH(userId));
    navigator(USER_PATH(userId));

    console.log('모달 닫기 호출');
    onClose();
  };

  /**
   *   TODO:  function:  유효성 검사 함수
   */
  const validatePassword = (newPassword: string): { isValid: boolean; errorMessage: string } => {
    const trimmedPassword = newPassword.trim();

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

  const onNewPasswordButtonClickHandler = () => {
    if (newPasswordButtonIcon === 'eyeOff') {
      setNewPasswordButtonIcon('eyeOn');
      setNewPasswordType('text');
    } else {
      setNewPasswordButtonIcon('eyeOff');
      setNewPasswordType('password');
    }
  };

  const onNewPasswordCheckButtonClickHandler = () => {
    if (newPasswordCheckButtonIcon === 'eyeOff') {
      setNewPasswordCheckButtonIcon('eyeOn');
      setNewPasswordCheckType('text');
    } else {
      setNewPasswordCheckButtonIcon('eyeOff');
      setNewPasswordCheckType('password');
    }
  };


  const onNewPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNewPassword(value);

    if (value === '') {
      setNewPasswordError(false);
      setNewPasswordErrorMessage('');
      setNewPasswordSuccessMessage('');
    } else {
      const { isValid, errorMessage } = validatePassword(value);
      setNewPasswordError(!isValid);
      setNewPasswordErrorMessage(errorMessage);

      if (isValid) {
        setNewPasswordSuccessMessage('사용 가능한 비밀번호입니다.');
      } else {
        setNewPasswordSuccessMessage('');
      }
    }
  };

  const onNewPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNewPasswordCheck(value);

    if (value === '') {
      setNewPasswordCheckError(false);
      setNewPasswordCheckErrorMessage('');
      setNewPasswordCheckSuccessMessage('');
    } else if (value !== newPassword) {
      setNewPasswordCheckError(true);
      setNewPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
      setNewPasswordCheckSuccessMessage('');
    } else {
      setNewPasswordCheckError(false);
      setNewPasswordCheckErrorMessage('');
      setNewPasswordCheckSuccessMessage('비밀번호가 일치합니다.');
    }
  };

  const onSubmitHandler = async () => {
    if (!signInUser || !signInUser.userId) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    let isFormValid = true;

    // 비밀번호 검증
    const isPasswordValid = validatePassword(newPassword).isValid;
    if (!newPassword || newPassword.trim().length === 0 || !isPasswordValid) {
      setNewPasswordError(true);
      setNewPasswordErrorMessage(newPassword ? "비밀번호는 8자 이상 20자 이하이어야 하며 숫자, 소문자, 대문자를 포함해야 합니다." : "비밀번호를 입력해주세요.");
      isFormValid = false;
    } else {
      setNewPasswordError(false);
      setNewPasswordErrorMessage("");
    }

    // 비밀번호 확인 검증
    const isPasswordCheckValid = newPasswordCheck === newPassword;
    if (!newPasswordCheck || newPasswordCheck.trim().length === 0 || !isPasswordCheckValid) {
      setNewPasswordCheckError(true);
      setNewPasswordCheckErrorMessage(newPasswordCheck ? "비밀번호가 일치하지 않습니다." : "비밀번호 확인을 입력해주세요.");
      isFormValid = false;
    } else {
      setNewPasswordCheckError(false);
      setNewPasswordCheckErrorMessage("");
    }

    // 모든 입력이 유효하면 처리
    if (isFormValid) {
      const accessToken = cookie.accessToken;
      const requestBody: PatchPasswordRequestDto = { newPassword, newPasswordCheck };

      patchPasswordRequest(requestBody as PatchPasswordRequestDto, accessToken).then(patchPasswordResponse);
    } else {
      alert("비밀번호 필수 입력값을 입력해 주세요.");
    }
  };

  return (
    <div className='modal-content-body-input-box'>
      {isSuccessMessage ? (
        // ✅ 성공 메시지만 표시 (폼 숨김)
        <div className='modal-content-body-success-text'>
          임시 비밀번호가 이메일로 전송되었습니다. <span>* 로그인 후 비밀번호를 꼭 변경해주세요. *</span>
        </div>
      ) : (
        mode === 'updatePassword' && (
          // ✅ 비밀번호 변경 폼
          <>
          <div className="modal-content-top">
            <div className="modal-content-subject">비밀번호 변경</div>
            <div className="modal-close-button" onClick={onClose}>
              <IonIcon icon={closeOutline} style={{ color: 'black', width: '24px', height: '24px' }} />
            </div>
          </div>
          <div className="modal-content-body">
            <InputBox
              ref={newPasswordRef}
              label="새 비밀번호*"
              type={newPasswordType}
              placeholder="비밀번호를 입력해주세요."
              value={newPassword}
              onChange={onNewPasswordChangeHandler}
              error={isNewPasswordError}
              message={newPasswordErrorMessage}
              successMessage={newPasswordSuccessMessage}
              icon={newPasswordButtonIcon}
              onButtonClick={onNewPasswordButtonClickHandler}
            />
            <InputBox
              ref={newPasswordCheckRef}
              label="새 비밀번호 확인*"
              type={newPasswordCheckType}
              placeholder="새 비밀번호를 입력해주세요."
              value={newPasswordCheck}
              onChange={onNewPasswordCheckChangeHandler}
              error={newPasswordCheckError}
              message={newPasswordCheckErrorMessage}
              successMessage={newPasswordCheckSuccessMessage}
              icon={newPasswordCheckButtonIcon}
              onButtonClick={onNewPasswordCheckButtonClickHandler}
            />
          </div>
          <div className="modal-content-bottom">
            <div className="blue-button" onClick={onSubmitHandler}>비밀번호 변경</div>
          </div>
          </>
          )
          )}
          </div>
        );
      }

      export default UpdateForm;