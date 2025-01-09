import ApiResponseDto from '../ApiResponse.dto';

export default interface GetBoardResponseDto extends ApiResponseDto {
  boardId: number;
  title: string;
  content: string;
  boardImageList: string[];
  createdDate: string;
  modifiedDate: string;
  deletedDate: string;
  viewCount: number;
  email: string;
  username: string;
  profileImage: string | null;
}