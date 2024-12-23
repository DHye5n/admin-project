import ApiResponseDto from '../ApiResponse.dto';

export default interface PostBoardResponseDto extends ApiResponseDto {
  title: string;
  content: string;
  writer: string;
  boardImageList: string[];
}