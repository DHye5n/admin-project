import './style.css';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { BoardListItem } from 'types/interface';

/**
 *  TODO: interface: TOP 3 List Item 컴포넌트 Properties
 * */
interface Props {
  top3ListItem: BoardListItem;
}

/**
 *  TODO: component: TOP 3 List Item 컴포넌트
 * */
export default function Top3Item({ top3ListItem }: Props) {
  /**
   *  TODO: state: properties
   * */
  const { boardId, title, content, boardTitleImage } = top3ListItem;
  const { likeCount, commentCount, viewCount } = top3ListItem;
  const { createdAt, username, profileImage } = top3ListItem;

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
   *  TODO: render: Top 3 List Item 컴포넌트 렌더링
   * */
  return (
    <div
      className='top3-list-item'
      style={{ backgroundImage: `url(${boardTitleImage})` }}
      onClick={onClickHandler}
    >
      <div className='top3-list-item-main-box'>
        <div className='top3-list-item-top'>
          <div className='top3-list-item-profile-box'>
            <div
              className='top3-list-item-profile-image'
              style={{
                backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`,
              }}
            ></div>
          </div>
          <div className='top3-list-item-write-box'>
            <div className='top3-list-item-username'>{username}</div>
            <div className='top3-list-item-write-date'>{createdAt}</div>
          </div>
        </div>

        <div className='top3-list-item-middle'>
          <div className='top3-list-item-title'>{title}</div>
          <div className='top3-list-item-content'>{content}</div>
        </div>

        <div className='top3-list-item-bottom'>
          <div className='top3-list-item-counts'>
            {`댓글 ${commentCount} · 좋아요 ${likeCount} · 조회수 ${viewCount}`}
          </div>
        </div>
      </div>
    </div>
  );
}
