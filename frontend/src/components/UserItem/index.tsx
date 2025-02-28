import { UserListItem } from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { USER_PATH } from 'constant';
import React from 'react';

/**
 *  TODO: interface: User List Item 컴포넌트 Properties
 * */
interface Props {
  userListItem: UserListItem;
}

/**
 *  TODO: component: User List Item 컴포넌트
 * */
export default function UserItem({ userListItem }: Props) {
  /**
   *  TODO: state: properties
   * */
  const { userId, email, username, profileImage, followersCount, followingsCount, role } = userListItem;

  /**
   *  TODO: function: navigate 함수
   * */
  const navigator = useNavigate();

  /**
   *  TODO: event handler: 유저 아이템 클릭 이벤트 처리 함수
   * */
  const onClickHandler = () => {
    navigator(USER_PATH(userId));
  };

  /**
   *  TODO: render: User List Item 컴포넌트 렌더링
   * */
  return (
    <div className='user-list-item' onClick={onClickHandler}>
      <div className='user-list-item-main-box'>
        <div className='user-list-item-top'>
          <div className='user-list-item-profile-box'>
            <div className='user-list-item-profile-image'
                 style={{
                   backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`,
                 }}
            ></div>
          </div>

          <div className='user-list-item-username'>{username}</div>
          <div className='user-list-item-role'>{role}</div>
          <div className='user-list-item-email'>{email}</div>
          <div className='user-list-item-counts'>
            <div>
              팔로워: {followersCount}명
            </div>
            <div>
              팔로잉: {followingsCount}명
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

