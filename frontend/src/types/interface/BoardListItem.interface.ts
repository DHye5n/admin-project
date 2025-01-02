export default interface BoardListItem {
  boardId: number;
  title: string;
  content: string;
  boardTitleImage: string | null;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdDate: string;
  modifiedDate: string;
  username: string;
  profileImage: string | null;
}
