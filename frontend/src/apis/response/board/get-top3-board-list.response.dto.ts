import ApiResponseDto from '../ApiResponse.dto';
import { BoardListItem } from 'types/interface';

export default interface GetTop3BoardListResponseDto extends ApiResponseDto {
  top3List: BoardListItem[];
}