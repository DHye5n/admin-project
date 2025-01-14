import './style.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { User } from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { useParams } from 'react-router-dom';
import useSignInUserStore from 'stores/login-user.store';


/**
 *  TODO: component: User 컴포넌트
 * */
export default function UserPage() {

  const { userEmail } = useParams();


  /**
   *  TODO: component: User 상단 컴포넌트
   * */
  const UserTop = () => {
    /**
     *  TODO:  state: 상태
     * */
    const [isMyPage, setMyPage] = useState<boolean>(true);

    const [isUsernameChange, setUsernameChange] = useState<boolean>(false);

    const [changeUsername, setChangeUsername] = useState<string>('');

    const [username, setUsername] = useState<string>('');

    const [profileImage, setProfileImage] = useState<string | null>(null);

    const { signInUser, setSignInUser, resetSignInUser } = useSignInUserStore();

    const imageInputRef = useRef<HTMLInputElement | null>(null);

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
    };

    const onUsernameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setChangeUsername(value);
    }

    /**
     *  TODO:  effect: 함수
     * */
    useEffect(() => {
      // if (!userEmail) return;
      setUsername('불로배');
      setProfileImage('https://image.production.fruitsfamily.com/public/product/resized%40width1125/pd5zxk4OlC-5A8D9172-DA78-48BD-8037-34A3F30892F6.jpg');
    }, []);

    /**
     *  TODO:  render: User 상단 컴포넌트 렌더링
     * */
    return (
      <div id='user-top-wrapper'>
        <div className='user-top-container'>
          {isMyPage ?
            <div className="user-top-my-profile-image-box" onClick={onProfileBoxClickHandler}>
              {profileImage !== null ?
                <div className="user-top-profile-image"
                     style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div> :
                  <div className='icon-box-large'>
                    <div className='icon image-box-white-icon'></div>
                  </div>
              }
              <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onProfileImageChangeHandler} />
            </div> :
            <div className="user-top-my-profile-image-box">
            <div className="user-top-profile-image"
                 style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div>
            </div>
          }

          <div className="user-top-info-box">
            <div className="user-top-info-username-box">
              {isMyPage ?
                <>
                {isUsernameChange ?
                  <input className='user-top-info-username-input' type='text' size={username.length + 1} value={changeUsername} onChange={onUsernameChangeHandler} /> :
                  <div className="user-top-info-username">{username}</div>
                }
                <div className="icon-button" onClick={onUsernameEditButtonClickHandler}>
                  <div className="icon edit-icon"></div>
                </div>
                </> :
                <div className="user-top-info-username">{username}</div>
            }

          </div>
            <div className="user-top-info-email">{'email@email.com'}</div>
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
     *  TODO:  render: User 하단 컴포넌트 렌더링
     * */
    return (
      <div></div>
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
