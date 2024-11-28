import './style.css';
import { BoardListItem } from 'types/interface';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from 'assets/image/default-profile-image.png';

/**
 *  TODO: interface: Board List Item 컴포넌트 Properties
 * */
interface Props {
  boardListItem: BoardListItem;
}

/**
 *  TODO: component: Board List Item 컴포넌트
 * */
export default function BoardItem({ boardListItem }: Props) {
  /**
   *  TODO: state: properties
   * */
  const { boardId, title, content, boardTitleImage } = boardListItem;
  const { likeCount, commentCount, viewCount } = boardListItem;
  const { createdAt, username, profileImage } = boardListItem;

  /**
   *  TODO: function: navigate 함수
   * */
  // const navigator = useNavigate();

  /**
   *  TODO: event handler: 게시물 아이템 클릭 이벤트 처리 함수
   * */
  const onClickHandler = () => {
    // navigator(boardId);
  };

  /**
   *  TODO: render: Board List Item 컴포넌트 렌더링
   * */
  return (
    <div className='board-list-item' onClick={onClickHandler}>
      <div className='board-list-item-main-box'>
        <div className='board-list-item-top'>
          <div className='board-list-item-profile-box'>
            <div
              className='board-list-item-profile-image'
              style={{
                backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`,
              }}
            ></div>
          </div>
          <div className='board-list-item-write-box'>
            <div className='board-list-item-username'>{username}</div>
            <div className='board-list-item-write-date'>{createdAt}</div>
          </div>
        </div>

        <div className='board-list-item-middle'>
          <div className='board-list-item-title'>{title}</div>
          <div className='board-list-item-content'>{content}</div>
        </div>

        <div className='board-list-item-bottom'>
          <div className='board-list-item-counts'>
            {`댓글 ${commentCount} · 좋아요 ${likeCount} · 조회수 ${viewCount}`}
          </div>
        </div>
      </div>
      {boardTitleImage !== null && (
        <div className='board-list-item-image-box'>
          <div
            className='board-list-item-image'
            style={{ backgroundImage: `url(${boardTitleImage})` }}
          ></div>
        </div>
      )}
    </div>
  );
}
