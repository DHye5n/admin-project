import ApiResponseDto from '../ApiResponse.dto';

export default interface SignInUserResponseDto extends ApiResponseDto {
  email: string;
  username: string;
  profileImage: string | null;
}