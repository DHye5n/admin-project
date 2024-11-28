export default interface BoardListItem {
  boardId: number;
  title: string;
  content: string;
  boardTitleImage: string | null;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  username: string;
  profileImage: string | null;
}
