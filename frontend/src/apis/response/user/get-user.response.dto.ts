import ApiResponseDto from '../ApiResponse.dto';
import Role from 'types/enum/Role';


export default interface GetUserResponseDto extends ApiResponseDto {
  userId: number;
  email: string;
  username: string;
  profileImage: string | null;
  phone: string;
  followersCount: number;
  followingsCount: number;
  following: boolean;
  role: Role;
}