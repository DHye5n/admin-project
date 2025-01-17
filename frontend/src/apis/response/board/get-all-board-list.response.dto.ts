import ApiResponseDto from '../ApiResponse.dto';
import { BoardListItem } from 'types/interface';

export default interface GetAllBoardListResponseDto extends ApiResponseDto {
  boardList: BoardListItem[];
}