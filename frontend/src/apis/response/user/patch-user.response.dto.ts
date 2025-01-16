import ApiResponseDto from '../ApiResponse.dto';

export default interface PatchUserResponseDto extends ApiResponseDto {
  username: string | null;
  profileImage: string | null;
}