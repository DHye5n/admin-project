import ApiResponseDto from '../ApiResponse.dto';
import { CommentListItem } from 'types/interface';

export default interface GetCommentListResponseDto extends ApiResponseDto {
  commentList: CommentListItem[];
}