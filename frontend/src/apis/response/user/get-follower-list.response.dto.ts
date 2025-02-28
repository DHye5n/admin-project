import ApiResponseDto from '../ApiResponse.dto';
import UserListItem from 'types/interface/UserListItem.interface';

export default interface GetFollowerListResponseDto extends ApiResponseDto {
  followerList: UserListItem[];
}