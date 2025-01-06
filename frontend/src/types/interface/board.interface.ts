export default interface Board {
  boardId: number;
  title: string;
  content: string;
  boardImageList: string[];
  createdDate: string;
  modifiedDate: string;
  viewCount: number;
  email: string;
  username: string;
  profileImage: string | null;
}
