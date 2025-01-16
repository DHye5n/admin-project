import ApiResponseDto from '../ApiResponse.dto';

export default interface GetUserResponseDto extends ApiResponseDto {
  email: string;
  username: string;
  profileImage: string | null;
  phone: string;
}