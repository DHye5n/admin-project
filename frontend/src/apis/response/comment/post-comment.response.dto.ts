import ApiResponseDto from '../ApiResponse.dto';

export default interface PostCommentResponseDto extends ApiResponseDto {
  comment: string;
}