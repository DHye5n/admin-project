import ApiResponseDto from '../ApiResponse.dto';

export default interface PatchCommentResponseDto extends ApiResponseDto {
  commentId: number;
  comment: string;
}