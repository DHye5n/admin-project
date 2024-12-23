import ApiResponseDto from '../ApiResponse.dto';

export default interface ViewCountResponseDto extends ApiResponseDto {
  boardId: string;
  viewCount: number;
}