import ApiResponseDto from '../ApiResponse.dto';

export default interface BoardPostResponseDto extends ApiResponseDto {
  title: string;
  content: string;
  writer: string;
  boardImageList: string[];
}