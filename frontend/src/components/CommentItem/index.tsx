import './style.css';
import { CommentListItem } from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { formatDate } from 'utils/dateUtils';
import React from 'react';

/**
 *  TODO: interface: Comment List Item 컴포넌트 Properties
 * */
interface Props {
  commentListItem: CommentListItem;
}

/**
 *  TODO: component: Comment List Item 컴포넌트
 * */
export default function CommentItem({ commentListItem }: Props) {
  /**
   *  TODO: state: properties
   * */
  const { username, profileImage, comment, createdDate, modifiedDate } = commentListItem;

  const getFormattedDate = (createdDate: string, modifiedDate: string | null) => {
    return modifiedDate && modifiedDate !== createdDate
      ? `${formatDate(modifiedDate)}`
      : `${formatDate(createdDate)}`;
  }

  /**
   *  TODO: render: Comment List Item 렌더링
   * */
  return (
    <div className='comment-list-item'>
      <div className="comment-list-item-top">
        <div className="comment-list-item-profile-box">
          <div
            className="comment-list-item-profile-image"
            style={{
              backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`,
            }}
          ></div>
        </div>
        <div className="comment-list-item-top-box">
          <div className="comment-list-item-info-box">
            <div className="comment-list-item-username">{username}</div>
            <div className="comment-list-item-divider">{'\|'}</div>
            <div className="comment-list-item-time">
              {getFormattedDate(createdDate, modifiedDate)}
            </div>
          </div>
          <div className='comment-list-item-button-box'>
            <div className="comment-list-item-update-button">{'수정'}</div>
            <div className="comment-list-item-divider">{'\|'}</div>
            <div className="comment-list-item-delete-button">{'삭제'}</div>
          </div>
        </div>
      </div>

      <div className="comment-list-item-main">
        <div className="comment-list-item-content">{comment}</div>
      </div>
    </div>
  );
}
