import './style.css';
import { CommentListItem } from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { formatDate } from 'utils/dateUtils';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import useSignInUserStore from 'stores/login-user.store';
import PatchCommentRequestDto from 'apis/request/comment/patch-comment.request.dto';
import { deleteCommentRequest, getCommentListRequest, patchCommentRequest } from 'apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ApiResponseDto } from 'apis/response';
import { PatchCommentResponseDto } from 'apis/response/comment';
import { AUTH_PATH, MAIN_PATH } from 'constant';
import { DeleteCommentResponseDto } from 'apis/response/comment';


/**
 *  TODO: interface: Comment List Item 컴포넌트 Properties
 * */
interface Props {
  commentListItem: CommentListItem;
  updateComment: (updatedComment: CommentListItem) => void;
  deleteComment: (deletedComment: CommentListItem) => void;
}

/**
 *  TODO: component: Comment List Item 컴포넌트
 * */
export default function CommentItem({ commentListItem, updateComment, deleteComment }: Props) {
  /**
   *  TODO: state: properties
   * */
  const { commentId, username, profileImage, comment, createdDate, modifiedDate } = commentListItem;

  const getFormattedDate = (createdDate: string, modifiedDate: string | null) => {
    return modifiedDate && modifiedDate !== createdDate
      ? `${formatDate(modifiedDate)}`
      : `${formatDate(createdDate)}`;
  };

  /**
   *  TODO:  state: 상태
   * */

  const [isCommentChange, setCommentChange] = useState<boolean>(false);

  const [changeComment, setChangeComment] = useState<string>('');

  const { signInUser, setSignInUser } = useSignInUserStore(state => state);

  const isMyComment = signInUser && signInUser.username === username;

  const [cookie, setCookie] = useCookies();

  const { boardId } = useParams();

  const [isAlertShown, setIsAlertShown] = useState<boolean>(false);

  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  /**
   *  TODO:  function: navigate 함수
   * */
  const navigator = useNavigate();

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
   *  TODO: function: comment patch response 처리 함수
   * */
  const patchCommentResponse = (responseBody: ApiResponseDto<PatchCommentResponseDto> | null) => {
    if (!responseBody) return;
    
    const { code, data } = responseBody;

    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    if (code === 'AF' || code === 'NFU') navigator(AUTH_PATH());
    if (code === 'VF') alert('내용은 필수입니다.');
    if (code === 'NFC') alert('댓글이 존재하지 않습니다.');
    if (code !== 'SU') return;

    setCommentChange(false);

    const updatedComment = { ...commentListItem, comment: changeComment };

    updateComment(updatedComment);
  };
  
  const deleteCommentResponse = (responseBody: ApiResponseDto<DeleteCommentResponseDto> | null) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code !== 'SU') {
      handleApiError(code);
      return;
    }

    alert('댓글이 삭제되었습니다.');

    deleteComment(commentListItem);
  }

  
  const onCommentEditButtonClickHandler = () => {
    setChangeComment(comment);
    setCommentChange(!isCommentChange);
  };

  const onCommentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setChangeComment(value);
  }

  const onCommentSaveButtonClickHandler = () => {
    const accessToken = cookie.accessToken;
    if (!accessToken) return;

    if (!changeComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    const requestBody: PatchCommentRequestDto = {
      comment: changeComment
    };

    if (!boardId) return;

    patchCommentRequest(boardId, commentId, requestBody, accessToken).then(patchCommentResponse);
  };

  const onCommentCancelButtonClickHandler = () => {
    setCommentChange(false);
    setChangeComment(comment);
  };

  const onCommentDeleteButtonClickHandler = () => {
    if (!boardId) return;

    const accessToken = cookie.accessToken;
    if (!checkLoginStatus(accessToken)) return;

    deleteCommentRequest(boardId, commentId, accessToken).then(deleteCommentResponse);
  };


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
          {isMyComment && (
            <div className='comment-list-item-button-box'>
              {isCommentChange ? (
                <>
                  <div className="comment-list-item-save-button" onClick={onCommentSaveButtonClickHandler}>
                    {'댓글 수정'}
                  </div>
                  <div className="comment-list-item-divider">{'\|'}</div>
                  <div className="comment-list-item-cancel-button" onClick={onCommentCancelButtonClickHandler}>
                    {'취소'}
                  </div>
                </>
              ) : (
                <>
                  <div className="comment-list-item-update-button" onClick={onCommentEditButtonClickHandler}>
                    {'수정'}
                  </div>
                  <div className="comment-list-item-divider">{'\|'}</div>
                  <div className="comment-list-item-delete-button" onClick={onCommentDeleteButtonClickHandler}>{'삭제'}</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="comment-list-item-main">
        {isCommentChange ? (
          <input
            className='comment-list-item-content-input'
            type='text'
            value={changeComment}
            onChange={onCommentChangeHandler}
            autoFocus
          />) : (
          <div className="comment-list-item-content">{comment}</div>
        )}
      </div>
    </div>
  );
}
