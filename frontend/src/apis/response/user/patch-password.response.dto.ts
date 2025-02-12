import ApiResponseDto from '../ApiResponse.dto';

export default interface PatchPasswordResponseDto extends ApiResponseDto {
  userId: number;
  email: string;
  username: string;
}