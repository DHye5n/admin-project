import './style.css';
import LikeItem from 'components/LikeItem';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { LikeListItem } from 'types/interface';
import likeListMock from 'mocks/like-list.mock';
import { CommentListItem } from 'types/interface';
import { boardMock, commentListMock } from 'mocks';
import CommentItem from 'components/CommentItem';
import Pagination from 'components/Pagination';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { chatbubbleEllipsesOutline, heart, heartOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import useSignInUserStore from 'stores/login-user.store';
import { useNavigate, useParams } from 'react-router-dom';
import { BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH } from 'constant';
import { Board } from 'types/interface';

/**
 *  TODO: component: Board Detail 컴포넌트
 * */
export default function BoardDetail() {
  /**
   *  TODO: state: 상태
   * */
  const { signInUser } = useSignInUserStore();

  const { boardId } = useParams();

  /**
   *  TODO: function: 함수
   * */
  const navigator = useNavigate();


  /**
   *  TODO: component: Board Detail Top 컴포넌트
   * */
  const BoardDetailTop = () => {
    /**
     *  TODO: state: 상태
     * */
    const [showMore, setShowMore] = useState<boolean>(false);

    const [board, setBoard] = useState<Board | null>(null);

    /**
     *  TODO: event handler: 버튼 클릭 이벤트 처리
     * */
    const onUsernameClickHandler = () => {
      if (!board) return;
      navigator(USER_PATH(board.email));
    }

    const onMoreButtonClickHandler = () => {
      setShowMore(!showMore);
    }

    const onUpdateButtonClickHandler = () => {
      if (!board || !signInUser) return;
      if (signInUser.email !== board.email) return;
      navigator(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(board.boardId));
    }

    const onDeleteButtonClickHandler = () => {
      if (!board || !signInUser) return;
      if (signInUser.email !== board.email) return;
      navigator(MAIN_PATH());
    }

    /**
     *  TODO: effect: 버튼 클릭 이벤트 처리
     * */
    useEffect(() => {
      setBoard(boardMock);
    }, [boardId]);

    /**
     *  TODO: render: Board Detail Top 렌더링
     * */
    if (!board) return <></>
    return (
      <div id='board-detail-top'>
        <div className='board-detail-top-header'>
          <div className='board-detail-title'>{board.title}</div>
          <div className='board-detail-top-sub-box'>
            <div className='board-detail-write-info-box'>
              <div className='board-detail-writer-profile-image' style={{ backgroundImage: `url(${board.profileImage ? board.profileImage : defaultProfileImage})` }}></div>
              <div className='board-detail-writer-username' onClick={onUsernameClickHandler}>{board.username}</div>
              <div className='board-detail-info-divider'>{'\|'}</div>
              <div className='board-detail-write-date'>{board.createdDate}</div>
            </div>
            <div className='icon-button' onClick={onMoreButtonClickHandler}>
              <div className='icon more-icon'></div>
            </div>
            {showMore &&
            <div className='board-detail-more-box'>
              <div className='board-detail-update-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div>
              <div className='divider'></div>
              <div className='board-detail-delete-button' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
            </div>
            }
          </div>
        </div>

        <div className='divider'></div>

        <div className='board-detail-top-main'>
          <div className='board-detail-main-text'>{board.content}</div>
          {board.boardImageList.map(image =>
            <img className='board-detail-main-image' src={image} />
          )}
        </div>
      </div>
    )
  }

  /**
   *  TODO: component: Board Detail Bottom 컴포넌트
   * */
  const BoardDetailBottom = () => {
    /**
     *  TODO: state: 상태
     * */
    const commentRef = useRef<HTMLTextAreaElement | null>(null);

    const [likeList, setLikeList] = useState<LikeListItem[]>([]);

    const [commentList, setCommentList] = useState<CommentListItem[]>([]);

    const [isLike, setLike] = useState<boolean>(false);

    const [showLike, setShowLike] = useState<boolean>(false);

    const [showComment, setShowComment] = useState<boolean>(false);

    const [comment, setComment] = useState<string>('');

    /**
     *  TODO: event handler: 이벤트 핸들러
     * */
    const onLikeClickHandler = () => {
      setLike(!isLike);
    }

    const onShowLikeListClickHandler = () => {
      setShowLike(!showLike);
    }

    const onShowCommentListClickHandler = () => {
      setShowComment(!showComment);
    }

    const onCommentSubmitButtonClickHandler = () => {
      if (!comment) return;
      alert('댓글 작성이 완료되었습니다!');
    }

    const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      setComment(value);
      if (!commentRef.current) return;
      commentRef.current.style.height = 'auto';
      commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
    }

    /**
     *  TODO: effect: 함수
     * */
    useEffect(() => {
      setLikeList(likeListMock);
      setCommentList(commentListMock);
    }, []);

    /**
     *  TODO: render: Board Detail Bottom 렌더링
     * */
    return (
      <div id='board-detail-bottom'>
        <div className='board-detail-bottom-button-box'>
          <div className="board-detail-bottom-button-group">
            <div className="icon-button" onClick={onLikeClickHandler}>
              {isLike ?
                <IonIcon icon={heart} style={{ width: '24px', height: '24px', color: 'red' }} /> :
                <IonIcon icon={heartOutline} style={{ width: '24px', height: '24px' }} />
              }
            </div>
            <div className="board-detail-bottom-button-text">{`좋아요 ${likeList.length}`}</div>
            <div className="icon-button" onClick={onShowLikeListClickHandler}>
              {showLike ?
                <div className="icon up-light-icon"></div> :
                <div className="icon down-light-icon"></div>
              }
            </div>
          </div>
          <div className="board-detail-bottom-button-group">
            <div className="icon-button">
              <IonIcon icon={chatbubbleEllipsesOutline} style={{ width: '24px', height: '24px' }} />
            </div>
            <div className="board-detail-bottom-button-text">{`댓글 ${commentList.length}`}</div>
            <div className="icon-button" onClick={onShowCommentListClickHandler}>
              {showComment ?
                <div className="icon up-light-icon"></div> :
                <div className="icon down-light-icon"></div>
              }
            </div>
          </div>
        </div>
        {showLike &&
          <div className="board-detail-bottom-like-box">
            <div className='board-detail-bottom-like-container'>
              <div className='board-detail-bottom-like-title'>
                {'좋아요 '}<span className='emphasis'>{likeList.length}</span>
              </div>
              <div className='board-detail-bottom-like-contents'>
                {likeList.map(item => <LikeItem likeListItem={item} />)}
              </div>
            </div>
          </div>
        }
        {showComment &&
          <div className='board-detail-bottom-comment-box'>
            <div className='board-detail-bottom-comment-container'>
              <div className="board-detail-bottom-comment-title">
                {'댓글 '}<span className="emphasis">{commentList.length}</span>
              </div>
              <div className='board-detail-bottom-comment-list-container'>
                {commentList.map(item => <CommentItem commentListItem={item} />)}
              </div>
            </div>

            <div className='divider'></div>

            <div className='board-detail-bottom-comment-pagination-box'>
              <Pagination />
            </div>

            <div className='board-detail-bottom-comment-input-box'>
              <div className='board-detail-bottom-comment-input-container'>
                <textarea className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요.' value={comment}
                onChange={onCommentChangeHandler} ref={commentRef} />
                <div className='board-detail-bottom-comment-button-box'>
                  <div className={comment === '' ? 'disable-button' : 'blue-button'} onClick={onCommentSubmitButtonClickHandler}>{'댓글달기'}</div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }

  /**
   *  TODO:  render: Board Detail 컴포넌트 렌더링
   * */
  return (
    <div id='board-detail-wrapper'>
      <div className='board-detail-container'>
        <BoardDetailTop />
        <BoardDetailBottom />
      </div>
    </div>
  )
}
