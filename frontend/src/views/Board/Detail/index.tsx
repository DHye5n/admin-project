import './style.css';
import LikeItem from 'components/LikeItem';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { LikeListItem } from 'types/interface';
import { CommentListItem } from 'types/interface';
import CommentItem from 'components/CommentItem';
import Pagination from 'components/Pagination';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { chatbubbleEllipsesOutline, heart, heartOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import useSignInUserStore from 'stores/login-user.store';
import { useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH } from 'constant';
import { Board } from 'types/interface';
import {
  deleteBoardRequest,
  getBoardRequest,
  getCommentListRequest,
  getLikeListRequest,
  postCommentRequest,
  putLikeRequest,
  viewCountRequest,
} from 'apis';
import { ApiResponseDto } from 'apis/response';
import { useCookies } from 'react-cookie';
import { formatDate } from 'utils/dateUtils';
import { ViewCountResponseDto, GetBoardResponseDto } from 'apis/response/board';
import { GetCommentListResponseDto, GetLikeListResponseDto } from 'apis/response/board';
import { DeleteBoardResponseDTO, PutLikeResponseDto } from '../../../apis/response/board';
import PostCommentRequestDto from '../../../apis/request/comment/post-comment.request.dto';
import PostCommentResponseDto from '../../../apis/response/comment/post-comment.response.dto';

/**
 *  TODO: component: Board Detail 컴포넌트
 * */
export default function BoardDetail() {
  /**
   *  TODO: state: 상태
   * */
  const { signInUser } = useSignInUserStore();

  const { boardId } = useParams();

  const [cookie, setCookie] = useCookies();

  const [effectFlag, setEffectFlag] = useState(true);

  /**
   *  TODO: function: 함수
   * */
  const navigator = useNavigate();

  const viewCountResponse = (responseBody: ApiResponseDto<ViewCountResponseDto> | null) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code === 'NFB') alert('존재하지 않는 게시물입니다.');
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
  }

  /**
   *  TODO: component: Board Detail Top 컴포넌트
   * */
  const BoardDetailTop = () => {
    /**
     *  TODO: state: 상태
     * */
    const [showMore, setShowMore] = useState<boolean>(false);

    const [board, setBoard] = useState<Board | null>(null);

    const [isWriter, setWriter] = useState<boolean>(false);

    /**
     *  TODO: function: 함수
     * */
    const getBoardResponse = (responseBody: ApiResponseDto<GetBoardResponseDto> | null) => {
      if (!responseBody) return;

      const { code } = responseBody;
      if (code === 'NFB') alert('존재하지 않는 게시물입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') {
        navigator(MAIN_PATH());
        return;
      }

      const board: Board = { ...responseBody.data as GetBoardResponseDto };
      setBoard(board);

      if (!signInUser) {
        setWriter(false);
        return;
      }
      const isWriter = signInUser.email === board.email;
      setWriter(isWriter);
    }

    const deleteBoardResponse = (responseBody: ApiResponseDto<DeleteBoardResponseDTO> | null) => {
      if (!responseBody) return;

      const { code } = responseBody;
      if (code === 'NFB') alert('존재하지 않는 게시물입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code === 'VF') alert('잘못된 접근입니다.');
      if (code === 'NFU') alert('존재하지 않는 유저입니다.');
      if (code === 'AF') alert('인증에 실패했습니다.');
      if (code === 'NP') alert('권한이 없습니다.');
      if (code !== 'SU') return;

      alert('게시물이 삭제되었습니다.');
      navigator(MAIN_PATH());
    }

    const getFormattedDate = (createdDate: string, modifiedDate: string | null) => {
      return modifiedDate && modifiedDate !== createdDate
        ? `${formatDate(modifiedDate)}`
        : `${formatDate(createdDate)}`;
    }

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
      if (!board || !signInUser || !boardId) return;
      if (signInUser.email !== board.email) return;

      const accessToken = cookie.accessToken;
      if (!accessToken) {
        navigator(AUTH_PATH());
        return;
      }

      deleteBoardRequest(boardId, accessToken).then(deleteBoardResponse);
    }

    /**
     *  TODO: effect: 마운트 시 실행할 함수
     * */
    useEffect(() => {
      const accessToken = cookie.accessToken;
      if (!accessToken) {
        navigator(AUTH_PATH());
        return;
      }

      if (!boardId) {
        navigator(MAIN_PATH());
        return;
      }

      getBoardRequest(boardId, accessToken).then(getBoardResponse);
    }, [boardId]);

    /**
     *  TODO: render: Board Detail Top 렌더링
     * */
    if (!board) return <></>;
    return (
      <div id='board-detail-top'>
        <div className='board-detail-top-header'>
          <div className='board-detail-title'>{board.title}</div>
          <div className='board-detail-top-sub-box'>
            <div className='board-detail-write-info-box'>
              <div className='board-detail-writer-profile-image' style={{ backgroundImage: `url(${board.profileImage ? board.profileImage : defaultProfileImage})` }}></div>
              <div className='board-detail-writer-username' onClick={onUsernameClickHandler}>{board.username}</div>
              <div className='board-detail-info-divider'>{'\|'}</div>
              <div className='board-detail-write-date'>
                {getFormattedDate(board.createdDate, board.modifiedDate)}
              </div>
            </div>
            {signInUser && isWriter && (
              <div className='icon-button' onClick={onMoreButtonClickHandler}>
                <div className='icon more-icon'></div>
              </div>
            )}
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
          {board.boardImageList.map((image, index) => (
            <img key={index} className='board-detail-main-image' src={image} />
          ))}
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
      if (!signInUser || !boardId) return;

      const accessToken = cookie.accessToken;
      if (!accessToken) {
        navigator(AUTH_PATH());
        return;
      }

      putLikeRequest(boardId, accessToken).then(putLikeResponse);

    }

    const onShowLikeListClickHandler = () => {
      setShowLike(!showLike);
    }

    const onShowCommentListClickHandler = () => {
      setShowComment(!showComment);
    }

    const onCommentSubmitButtonClickHandler = () => {
      if (!comment || !boardId || !signInUser) return;

      const accessToken = cookie.accessToken;
      if (!accessToken) {
        navigator(AUTH_PATH());
        return;
      }

      const requestBody: PostCommentRequestDto = { comment: comment };

      postCommentRequest(boardId, requestBody, accessToken).then(postCommentResponse);
    }

    const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      setComment(value);
      if (!commentRef.current) return;
      commentRef.current.style.height = 'auto';
      commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
    }

    const getLikeListResponse = (responseBody: ApiResponseDto<GetLikeListResponseDto> | null) => {
      if (!responseBody) return;

      const { code } = responseBody;
      if (code === 'NFB') alert('존재하지 않는 게시물입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const { likeList } = responseBody.data as GetLikeListResponseDto;
      setLikeList(likeList);

      if (Array.isArray(likeList)) {
        likeList.forEach(like => {
          if (!signInUser) {
            setLike(false);
            return;
          }
          const isLike = likeList.findIndex(like => like.email === signInUser.email) !== -1;
          setLike(isLike);
        });
      }
    }

    const putLikeResponse = (responseBody: ApiResponseDto<PutLikeResponseDto> | null) => {
      if (!responseBody || !responseBody.data) return;

      const accessToken = cookie.accessToken;

      const { code } = responseBody;
      if (code === 'NFB') alert('존재하지 않는 게시물입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code === 'VF') alert('잘못된 접근입니다.');
      if (code === 'NFU') alert('존재하지 않는 유저입니다.');
      if (code === 'AF') alert('인증에 실패했습니다.');
      if (code !== 'SU') return;

      setLike(responseBody.data?.liking);

      if (!boardId) return;
      getLikeListRequest(boardId, accessToken).then(getLikeListResponse);
    }

    const postCommentResponse = (responseBody: ApiResponseDto<PostCommentResponseDto> | null) => {
      if (!responseBody) return;

      const accessToken = cookie.accessToken;

      const { code } = responseBody;
      if (code === 'NFB') alert('존재하지 않는 게시물입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code === 'VF') alert('잘못된 접근입니다.');
      if (code === 'NFU') alert('존재하지 않는 유저입니다.');
      if (code === 'AF') alert('인증에 실패했습니다.');
      if (code !== 'SU') return;

      setComment('');

      if (!boardId) return;
      getCommentListRequest(boardId, accessToken).then(getCommentListResponse);
    }

    const getCommentListResponse = (responseBody: ApiResponseDto<GetCommentListResponseDto> | null) => {
      if (!responseBody) return;

      const { code } = responseBody;
      if (code === 'NFB') alert('존재하지 않는 게시물입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const { commentList } = responseBody.data as GetCommentListResponseDto;
      setCommentList(commentList);
    }

    /**
     *  TODO: effect: 함수
     * */
    useEffect(() => {
      const accessToken = cookie.accessToken;

      if (!accessToken) {
        navigator(AUTH_PATH());
        return;
      }

      if (!boardId) return;

      getLikeListRequest(boardId, accessToken).then(getLikeListResponse);
      getCommentListRequest(boardId, accessToken).then(getCommentListResponse);
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
                (<IonIcon icon={heart} style={{ width: '24px', height: '24px', color: 'red' }} />) :
                (<IonIcon icon={heartOutline} style={{ width: '24px', height: '24px' }} />)
              }
            </div>
            <div className="board-detail-bottom-button-text">
              {`좋아요 ${likeList ? likeList.length : 0}`}
            </div>
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
            <div className="board-detail-bottom-button-text">
              {`댓글 ${commentList ? commentList.length : 0}`}
            </div>
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
                {'좋아요 '}<span className='emphasis'>{likeList ? likeList.length : 0}</span>
              </div>
              <div className='board-detail-bottom-like-contents'>
                {likeList.map((item, index) => (
                  <LikeItem key={`${item.email}-${index}`} likeListItem={item} />
                ))}
              </div>
            </div>
          </div>
        }
        {showComment &&
          <div className='board-detail-bottom-comment-box'>
            <div className='board-detail-bottom-comment-container'>
              <div className="board-detail-bottom-comment-title">
                {'댓글 '}<span className="emphasis">{commentList ? commentList.length : 0}</span>
              </div>
              <div className='board-detail-bottom-comment-list-container'>
                {commentList
                  .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
                  .map((item, index) => (
                  <CommentItem key={`${item.username}-${index}`} commentListItem={item} />
                ))}
              </div>
            </div>

            <div className='divider'></div>

            <div className='board-detail-bottom-comment-pagination-box'>
              <Pagination />
            </div>
          {signInUser !== null &&
            <div className='board-detail-bottom-comment-input-box'>
              <div className='board-detail-bottom-comment-input-container'>
                <textarea className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요.' value={comment}
                onChange={onCommentChangeHandler} ref={commentRef} />
                <div className='board-detail-bottom-comment-button-box'>
                  <div className={comment === '' ? 'disable-button' : 'blue-button'} onClick={onCommentSubmitButtonClickHandler}>{'댓글달기'}</div>
                </div>
              </div>
            </div>
          }
          </div>
        }
      </div>
    )
  };

  /**
   *  TODO:  effect: 게시물 조회수 증가
   * */
  useEffect(() => {
    const accessToken = cookie.accessToken;
    if (!accessToken) {
      navigator(AUTH_PATH());
      return;
    }

    if (!boardId) return;

    if (effectFlag) {
      setEffectFlag(false);
      return;
    }

    viewCountRequest(boardId, accessToken).then(viewCountResponse);
  }, [boardId, effectFlag]);

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
