import ApiResponseDto from '../ApiResponse.dto';

export default interface GetBoardResponseDto extends ApiResponseDto {
  boardId: number;
  title: string;
  content: string;
  boardImageList: string[];
  createdDate: string;
  modifiedDate: string;
  email: string;
  username: string;
  profileImage: string | null;
}