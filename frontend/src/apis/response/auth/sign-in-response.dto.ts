import ApiResponseDto from '../ApiResponse.dto';

export default interface SignInResponseDto extends ApiResponseDto {
  accessToken: string;
  expirationTime: number;
}