export default interface CommentListItem {
  commentId: number;
  username: string;
  profileImage: string | null;
  comment: string;
  createdDate: string;
  modifiedDate: string;
}
