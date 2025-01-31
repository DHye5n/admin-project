import ApiResponseDto from '../ApiResponse.dto';
import { BoardListItem } from 'types/interface';

export default interface GetUserBoardListResponseDto extends ApiResponseDto {
  userBoardList: BoardListItem[];
  userId: number;
}