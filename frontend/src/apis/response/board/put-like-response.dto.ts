import ApiResponseDto from '../ApiResponse.dto';

export default interface PutLikeResponseDto extends ApiResponseDto {
  boardId: number;
  liking: boolean;
}