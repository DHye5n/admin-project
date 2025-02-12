import './style.css';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { BoardListItem, User } from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { data, useNavigate, useParams } from 'react-router-dom';
import useSignInUserStore from 'stores/login-user.store';
import Pagination from 'components/Pagination';
import { usePagination } from 'hooks';
import BoardItem from 'components/BoardItem';
import { AUTH_PATH, BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH } from 'constant';
import {
  duplicateUsernameCheck,
  fileUploadRequest,
  getUserBoardListRequest,
  getUserRequest,
  patchUserRequest, putFollowRequest,
} from 'apis';
import { ApiResponseDto } from 'apis/response';
import { GetUserResponseDto } from 'apis/response/user';
import { useCookies } from 'react-cookie';
import { PatchUserRequestDto } from 'apis/request/user';
import { PatchUserResponseDto } from 'apis/response/user';
import { IonIcon } from '@ionic/react';
import { personAddOutline, personOutline, personRemoveOutline } from 'ionicons/icons';
import { GetUserBoardListResponseDto } from 'apis/response/board';
import { PutFollowResponseDto } from 'apis/response/user';
import Modal from 'components/Modal';


/**
 *  TODO: component: User 컴포넌트
 * */
export default function UserPage() {
  /**
   *  TODO:  state: 상태
   * */
  const { userId, followId } = useParams();

  const [isMyPage, setMyPage] = useState<boolean>(false);

  const [isAlertShown, setIsAlertShown] = useState<boolean>(false);

  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { signInUser, setSignInUser } = useSignInUserStore();

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

    const [email, setEmail] = useState<string>('');

    const [phone, setPhone] = useState<string>('');

    const [followersCount, setFollowersCount] = useState<number>(0);

    const [followingsCount, setFollowingsCount] = useState<number>(0);

    const [isFollow, setFollow] = useState<boolean>(false);

    const [user, setUser] = useState<User | null>(null);

    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [mode, setMode] = useState<'updatePassword'>('updatePassword');

    const openModal = () => {
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
    };

    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const [isUsernameError, setUsernameError] = useState<boolean>(false);

    const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>('');

    const usernameRef = useRef<HTMLInputElement | null>(null);

    const [usernameSuccessMessage, setUsernameSuccessMessage] = useState<string>('');

    const [usernameButtonIcon, setUsernameButtonIcon] = useState<'person' | 'personError' | 'personSuccess'>('person');

    const formatPhoneNumber = (phone: string) => {
      const phoneStr = phone.replace(/[^0-9]/g, '');

      if (phoneStr.length === 11) {
        return phoneStr.replace(/^(\d{3})(\d{4})(\d{1})(\d{3})$/, '$1-$2-$3xxx');
      }
      return phone;
    };

    const formatMyPhoneNumber = (phone: string) => {
      const phoneStr = phone.replace(/[^0-9]/g, '');

      if (phoneStr.length === 11) {
        return phoneStr.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
      }
      return phone;
    };

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

      const user: User = { ...responseBody.data as GetUserResponseDto };

      setUser(user);

      if (!signInUser) {
        setMyPage(false);
        return;
      }
      const isMyPage = user.userId === signInUser?.userId;
      setProfileImage(user.profileImage);
      setEmail(user.email);
      setUsername(user.username);
      setPhone(user.phone);
      setFollowersCount(user.followersCount);
      setFollowingsCount(user.followingsCount);
      setFollow(user.following);
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

      if (!userId) {
        console.error("userId is null.");
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

      if (!userId) return;

      getUserRequest(userId, cookie.accessToken).then(getUserResponse);

      alert('프로필 수정이 완료되었습니다.');
      if (!userId) return;
      navigator(USER_PATH(userId));
    };

    const putFollowResponse = (responseBody: ApiResponseDto<PutFollowResponseDto> | null) => {
      console.log("팔로우 응답 수신:", responseBody);
      if (!responseBody || !responseBody.data) return;

      const accessToken = cookie.accessToken;
      if (!checkLoginStatus(accessToken)) return;

      const { code } = responseBody;
      if (code !== 'SU') {
        handleApiError(code);
        return;
      }

      setFollow(responseBody.data?.following);

      if (!userId) return;

      getUserRequest(userId, cookie.accessToken).then(getUserResponse);

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
      const accessToken = cookie.accessToken;
      const requestBody: Partial<PatchUserRequestDto> = {};

      if (profileImage && profileImage !== defaultProfileImage) {
        requestBody.profileImage = profileImage;
      }

      if (changeUsername && changeUsername !== username) {
        requestBody.username = changeUsername;
      }

      if (Object.keys(requestBody).length > 0) {
        if (userId != null) {
          patchUserRequest(userId, requestBody as PatchUserRequestDto, accessToken).then(patchUserResponse);
        }
      } else {
        console.log("변경된 내용이 없습니다.");
      }
    };

    const onUsernameButtonClickHandler = async () => {

      const response = await duplicateUsernameCheck(changeUsername);

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

    const onFollowButtonClickHandler = () => {
      const accessToken = cookie.accessToken;
      if (!checkLoginStatus(accessToken)) return;

      if (!userId) return;

      putFollowRequest(userId, accessToken).then(putFollowResponse);
    };

    /**
     *  TODO:  effect: 함수
     * */
    useEffect(() => {

      const accessToken = cookie.accessToken;
      if (!checkLoginStatus(accessToken)) return;

      if (!userId) return;

      getUserRequest(userId, accessToken).then(getUserResponse);
    }, [userId]);

    /**
     *  TODO:  render: User 상단 컴포넌트 렌더링
     * */
    if (!user) return <></>;
    return (
      <div id='user-top-wrapper'>
        <div className="user-top-container">

          <div className="user-top-top-box">
            <div className="user-top-title">
              {'프로필'}
            </div>
            {isMyPage ?
              <div className="user-profile-edit-box" onClick={onSaveButtonClickHandler}>
                <div className="icon-box">
                  <div className="icon edit-icon"></div>
                </div>
                <div className="user-side-text">{'프로필 수정'}</div>
              </div> :
              <div className="user-follow-box" onClick={onFollowButtonClickHandler}>
                {isFollow ? (
                  <div className="user-follow-button">
                    <IonIcon icon={personRemoveOutline} style={{ width: '16px', height: '16px' }} />
                    <span className="user-follow-text">언팔로우</span>
                  </div>
                ) : (
                  <div className='user-follow-button'>
                    <IonIcon icon={personAddOutline} style={{ width: '16px', height: '16px' }} />
                    <span className="user-follow-text">팔로우</span>
                  </div>
                )}
              </div>
            }
          </div>

          <div className="user-top-information-box">
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
              <div className='user-top-info-follow-box'>
                팔로워: {followersCount}
                <div className="user-top-divider">{'\|'}</div>
                팔로잉: {followingsCount}
              </div>
              <div className="user-top-info-email">*이메일: {email}</div>
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
                      <div className="user-top-info-username">*아이디: {username}</div>
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
                  <div className="user-top-info-username">*아이디: {username}</div>
                )}
              </div>
              {isMyPage ?
                <div className="user-top-info-phone">*핸드폰: {formatMyPhoneNumber(phone)}</div> :
                <div className="user-top-info-phone">*핸드폰: {formatPhoneNumber(phone)}</div>
              }

              {isMyPage ?
                <div className='user-top-info-update-box'>
                  <div className="user-top-info-password-update" onClick={() => openModal()}>
                    *비밀번호 변경
                    <div className="icon-button" onClick={() => openModal()}>
                      <div className="icon edit-icon"></div>
                    </div>
                  </div>
                  {isModalOpen && <Modal isOpen={isModalOpen} mode={mode} onClose={closeModal} />}
                </div>
                :
                <></>
              }

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

    const { userId } = useParams();

    const [username, setUsername] = useState<string>('');

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

      const user: User = { ...responseBody.data as GetUserResponseDto };

      setUsername(user.username);
    };

    /**
     *  TODO: effect: 마운트 시 실행할 함수
     * */
    useEffect(() => {

      const accessToken = cookie.accessToken;
      if (!checkLoginStatus(accessToken)) return;

      if (!userId) return;

      getUserBoardListRequest(userId, accessToken).then(getUserBoardListResponse);
      getUserRequest(userId, accessToken).then(getUserResponse);

    }, [userId]);

    /**
     *  TODO:  render: User 하단 컴포넌트 렌더링
     * */
    return (
      <div id='user-bottom-wrapper'>
        <div className='user-bottom-container'>
          <div className='user-bottom-contents-box'>
            <div className="user-bottom-top-box">
              <div className="user-bottom-title">
                {isMyPage ? (<>내 게시물 </>) : (
                  <><span className="emphasis">{username}</span>님의 게시물{' '}</>
                )}
                <span className="emphasis">{count}</span>
              </div>

              <div className='user-board-write-box' onClick={onMoveClickHandler}>
                    <div className="icon-box">
                      <div className="icon edit-icon"></div>
                    </div>
                    <div className="user-side-text">{'글 작성'}</div>
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
