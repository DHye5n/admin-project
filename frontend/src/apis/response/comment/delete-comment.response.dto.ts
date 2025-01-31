import ApiResponseDto from '../ApiResponse.dto';

export default interface DeleteCommentResponseDto extends ApiResponseDto {
  commentId: number;
}