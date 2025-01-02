import ApiResponseDto from '../ApiResponse.dto';
import { BoardListItem } from 'types/interface';

export default interface GetTop3BoardListResponseDTO extends ApiResponseDto {
  top3List: BoardListItem[];
}