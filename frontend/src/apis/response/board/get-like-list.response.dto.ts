import ApiResponseDto from '../ApiResponse.dto';
import { LikeListItem } from 'types/interface';

export default interface GetLikeListResponseDto extends ApiResponseDto {
  likeList: LikeListItem[]
}