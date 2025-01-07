import ApiResponseDto from '../ApiResponse.dto';
import { BoardListItem } from 'types/interface';

export default interface GetSearchBoardListResponseDto extends ApiResponseDto {
  searchList: BoardListItem[];
}