import './style.css';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { BoardListItem, User } from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { data, useNavigate, useParams } from 'react-router-dom';
import useSignInUserStore from 'stores/login-user.store';
import Pagination from 'components/Pagination';
import { usePagination } from 'hooks';
import { latestBoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import { AUTH_PATH, BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH } from 'constant';
import {
  checkUsernameExists,
  fileUploadRequest,
  getUserBoardListRequest,
  getUserRequest,
  patchUserRequest,
  signInUserRequest,
} from 'apis';
import { ApiResponseDto } from 'apis/response';
import { GetUserResponseDto } from 'apis/response/user';
import { useCookies } from 'react-cookie';
import { PatchUserRequestDto } from 'apis/request/user';
import { PatchUserResponseDto } from 'apis/response/user';
import { IonIcon } from '@ionic/react';
import { personOutline } from 'ionicons/icons';
import { GetUserBoardListResponseDto } from 'apis/response/board';


/**
 *  TODO: component: User 컴포넌트
 * */
export default function UserPage() {
  /**
   *  TODO:  state: 상태
   * */
  const { email } = useParams();

  const [isMyPage, setMyPage] = useState<boolean>(true);

  const [isAlertShown, setIsAlertShown] = useState<boolean>(false);

  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { signInUser, setSignInUser } = useSignInUserStore(state => state);

  const navigator = useNavigate();

  const [cookie, setCookie] = useCookies();

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

  const checkLoginStatus = (accessToken: string | undefined) => {
    if (!accessToken) {
      navigator(AUTH_PATH());
      return false;
    }
    return true;
  };

  /**
   *  TODO: component: User 상단 컴포넌트
   * */
  const UserTop = () => {
    /**
     *  TODO:  state: 상태
     * */

    const [isUsernameChange, setUsernameChange] = useState<boolean>(false);

    const [changeUsername, setChangeUsername] = useState<string>('');

    const [username, setUsername] = useState<string>('');

    const [phone, setPhone] = useState<string>('');

    const [profileImage, setProfileImage] = useState<string | null>(null);

    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const [isUsernameError, setUsernameError] = useState<boolean>(false);

    const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>('');

    const usernameRef = useRef<HTMLInputElement | null>(null);

    const [usernameSuccessMessage, setUsernameSuccessMessage] = useState<string>('');

    const [usernameButtonIcon, setUsernameButtonIcon] = useState<'person' | 'personError' | 'personSuccess'>('person');

    /**
     *  TODO:  function: response 처리 함수
     * */
    const getUserResponse = (responseBody: ApiResponseDto<GetUserResponseDto> | null) => {
      if (!responseBody) {
        navigator(MAIN_PATH());
        return;
      }

      const { code } = responseBody;
      if (code !== 'SU') {
        handleApiError(code);
        return;
      }

      const { email, username, profileImage, phone } = responseBody.data as GetUserResponseDto;
      setUsername(username);
      setProfileImage(profileImage);
      setPhone(phone);

      const isMyPage = email === signInUser?.email;
      setMyPage(isMyPage);

    };


    const fileUploadResponse = (responseBody: ApiResponseDto<string> | null) => {
      if (!responseBody || !responseBody.data) {
        return;
      }

      const profileImage = responseBody.data;
      if (!profileImage) {
        return;
      }

      if (!email) {
        console.error("Email is null.");
        return;
      }

      const requestBody: Partial<PatchUserRequestDto> = {
        profileImage
      };

      if (username) {
        requestBody.username = username;
      }

      setProfileImage(profileImage);
     
    };

    const patchUserResponse = (responseBody: ApiResponseDto<PatchUserResponseDto> | null) => {
      if (!responseBody) return;

      const { code } = responseBody;
      if (code !== 'SU') {
        handleApiError(code);
        return;
      }

      if (signInUser) {
        setSignInUser({
          ...signInUser,
          profileImage,
          username: changeUsername,
        });
      }

      getUserRequest(cookie.accessToken).then(getUserResponse);

      alert('프로필 수정이 완료되었습니다.');
      navigator(MAIN_PATH());

    };

    /**
     *  TODO:  event handler: 버튼 클릭 이벤트
     * */
    const onProfileBoxClickHandler = () => {
      if (!isMyPage) return;
      if (!imageInputRef.current) return;
      imageInputRef.current.click();
    };

    const onUsernameEditButtonClickHandler = () => {
      setChangeUsername(username);
      setUsernameChange(!isUsernameChange);
    };

    const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target || !event.target.files || !event.target.files.length) return;
      const file = event.target.files[0];
      const data = new FormData();
      data.append('file', file);

      fileUploadRequest(data, cookie.accessToken).then(fileUploadResponse);
    };

    const onUsernameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setChangeUsername(value);

      if (!value.trim()) {
        // 빈 값 또는 공백만 입력된 경우
        setUsernameError(true);
        setUsernameErrorMessage("아이디를 입력해주세요.");
        setUsernameSuccessMessage('');
        setUsernameButtonIcon('personError');
      } else if (!/^[a-zA-Z0-9가-힣]*$/.test(value)) {
        // 특수문자가 포함된 경우
        setUsernameError(true);
        setUsernameErrorMessage("아이디는 영어, 숫자, 한글만 사용해야 합니다.");
        setUsernameSuccessMessage('');
        setUsernameButtonIcon('personError');
      } else if (value.length < 3 || value.length > 10) {
        // 길이 조건 위반
        setUsernameError(true);
        setUsernameErrorMessage('아이디는 3자 이상, 10자 이하로 입력해주세요.');
        setUsernameSuccessMessage('');
        setUsernameButtonIcon('personError');
      } else {
        // Valid username
        setUsernameError(false);
        setUsernameErrorMessage('');
        setUsernameSuccessMessage('아이디 중복 인증을 해주세요.');
        setUsernameButtonIcon('person');
      }
    };

    const onSaveButtonClickHandler = () => {
      const requestBody: Partial<PatchUserRequestDto> = {};

      if (profileImage && profileImage !== defaultProfileImage) {
        requestBody.profileImage = profileImage;
      }

      if (changeUsername && changeUsername !== username) {
        requestBody.username = changeUsername;
      }

      if (Object.keys(requestBody).length > 0) {
        if (email != null) {
          patchUserRequest(email, requestBody as PatchUserRequestDto, cookie.accessToken).then(patchUserResponse);
        }
      } else {
        console.log("변경된 내용이 없습니다.");
      }
    };

    const onUsernameButtonClickHandler = async () => {

      const response = await checkUsernameExists(changeUsername);

      if (!username) {
        alert('아이디를 입력해주세요.');
        setUsernameError(true);
        setUsernameErrorMessage('아이디를 입력해주세요.');
        setUsernameSuccessMessage('');
        setUsernameButtonIcon('personError');
        return;
      }

      if (response && response.code === 'DU') {
        setUsernameError(true);
        setUsernameErrorMessage('중복되는 아이디입니다.');
        setUsernameButtonIcon('personError');
      } else if (response && response.code === 'SU') {
        setUsernameError(false);
        setUsernameErrorMessage('');
        setUsernameSuccessMessage('사용 가능한 아이디입니다.');
        setUsernameButtonIcon('personSuccess');
      } else {
        alert('아이디 중복 체크에 실패했습니다.');
      }
    };

    /**
     *  TODO:  effect: 함수
     * */
    useEffect(() => {

      const accessToken = cookie.accessToken;
      if (!checkLoginStatus(accessToken)) return;

      getUserRequest(accessToken).then(getUserResponse);
    }, []);

    /**
     *  TODO:  render: User 상단 컴포넌트 렌더링
     * */
    return (
      <div id='user-top-wrapper'>
        <div className="user-top-container">

          <div className="user-top-top-box">
            <div className="user-bottom-title">
              {isMyPage ? '프로필 ' : '게시물 '}
            </div>

            <div className="user-bottom-top-move-box" onClick={onSaveButtonClickHandler}>
              <div className="icon-box">
                <div className="icon edit-icon"></div>
              </div>
              <div className="user-bottom-side-text">{'프로필 수정'}</div>
            </div>
          </div>

          <div className='user-top-information-box'>
            {isMyPage ?
              <div className="user-top-my-profile-image-box" onClick={onProfileBoxClickHandler}>
                {profileImage !== null ?
                  <div className="user-top-profile-image"
                       style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div> :
                  <div className="icon-box-large">
                    <div className="icon image-box-white-icon"></div>
                  </div>
                }
                <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                       onChange={onProfileImageChangeHandler} />
              </div> :
              <div className="user-top-my-profile-image-box">
                <div className="user-top-profile-image"
                     style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div>
              </div>
            }


            <div className="user-top-info-box">
              <div className="user-top-info-email">이메일: {email}</div>
              <div className="user-top-info-username-box">
                {isMyPage ? (
                  <>
                    {isUsernameChange ? (
                      <div className="user-top-info-username-input-container">
                        <input
                          className={`user-top-info-username-input ${isUsernameError ? 'error' : ''} active`}
                          type="text"
                          size={changeUsername.length + 1}
                          value={changeUsername}
                          onChange={onUsernameChangeHandler}
                          autoFocus
                        />
                        {isUsernameError ?
                          <div className="username-error-message">{usernameErrorMessage}</div> :
                          <div className="username-success-message">{usernameSuccessMessage}</div>
                        }
                      </div>
                    ) : (
                      <div className="user-top-info-username">아이디: {username}</div>
                    )}
                    {isUsernameChange && (
                      <div className="icon-button" onClick={onUsernameButtonClickHandler}>
                        <IonIcon icon={personOutline} className="username-input-icon"
                                 style={{ color: isUsernameError ? 'red' : (usernameSuccessMessage ? 'green' : 'black') }} />
                      </div>
                    )}
                    <div className="icon-button" onClick={onUsernameEditButtonClickHandler}>
                      <div className="icon edit-icon"></div>
                    </div>
                  </>
                ) : (
                  <div className="user-top-info-username">아이디: {username}</div>
                )}
              </div>
              <div className="user-top-info-phone">핸드폰: {phone}</div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  /**
   *  TODO: component: User 하단 컴포넌트
   * */
  const UserBottom = () => {
    /**
     *  TODO: state: 상태
     * */
    const [count, setCount] = useState<number>();

    const {
      currentPage,
      setCurrentPage,
      currentSection,
      setCurrentSection,
      viewList,
      viewPageList,
      totalSection,
      setTotalList,
    } = usePagination<BoardListItem>(5);

    /**
     *  TODO: event handler: 클릭 이벤트 처리
     * */
    const onMoveClickHandler = () => {
      navigator(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
    };

    /**
     *  TODO: function: response 처리 함수
     * */
    const getUserBoardListResponse = (responseBody: ApiResponseDto<GetUserBoardListResponseDto> | null) => {
      if (!responseBody) return;

      const { code } = responseBody;
      if (code !== 'SU') {
        handleApiError(code);
        return;
      }

      const { userBoardList } = responseBody.data as GetUserBoardListResponseDto;
      setTotalList(userBoardList);
      setCount(userBoardList.length);
    };

    /**
     *  TODO: effect: 마운트 시 실행할 함수
     * */
    useEffect(() => {

      getUserBoardListRequest(cookie.accessToken).then(getUserBoardListResponse);

    }, []);

    /**
     *  TODO:  render: User 하단 컴포넌트 렌더링
     * */
    return (
      <div id='user-bottom-wrapper'>
        <div className='user-bottom-container'>
          <div className='user-bottom-contents-box'>
            <div className="user-bottom-top-box">
              <div className="user-bottom-title">
                {isMyPage ? '내 게시물 ' : '게시물 '}
                <span className="emphasis">{count}</span>
              </div>

              <div className='user-bottom-top-move-box' onClick={onMoveClickHandler}>
                    <div className="icon-box">
                      <div className="icon edit-icon"></div>
                    </div>
                    <div className="user-bottom-side-text">{'글 작성'}</div>
              </div>
            </div>

            <div className='user-bottom-board-contents-box'>
              {count === 0 ?
                <div className="user-bottom-contents-nothing">{'게시물이 없습니다.'}</div> :
                <div className="user-bottom-contents">
                  {viewList.map((boarListItem) => (
                    <BoardItem key={boarListItem.boardId} boardListItem={boarListItem} />
                  ))}
                </div>
              }
            </div>
          </div>

          <div className="user-bottom-pagination-box">
            {count !== 0 &&
            <Pagination currentPage={currentPage} currentSection={currentSection}
                        setCurrentPage={setCurrentPage} setCurrentSection={setCurrentSection}
                        viewPageList={viewPageList} totalSection={totalSection}/>
            }
          </div>

        </div>
      </div>
    );
  };


  /**
   *  TODO:  render: User 컴포넌트 렌더링
   * */
  return (
    <>
      <UserTop />
      <UserBottom />
    </>
  );
}
