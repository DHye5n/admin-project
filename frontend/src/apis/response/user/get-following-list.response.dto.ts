import ApiResponseDto from '../ApiResponse.dto';
import UserListItem from 'types/interface/UserListItem.interface';

export default interface GetFollowingListResponseDto extends ApiResponseDto {
  followingList: UserListItem[];
}