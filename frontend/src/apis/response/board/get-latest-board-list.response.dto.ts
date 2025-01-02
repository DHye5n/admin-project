import ApiResponseDto from '../ApiResponse.dto';
import { BoardListItem } from 'types/interface';

export default interface GetLatestBoardListResponseDto extends ApiResponseDto {
  latestList: BoardListItem[];
}