import UserListItem from 'types/interface/UserListItem.interface';
import ApiResponseDto from '../ApiResponse.dto';

export default interface GetAllUserListResponseDto extends ApiResponseDto {
  userList: UserListItem[];
}