import ApiResponseDto from '../ApiResponse.dto';

export default interface SignInResponseDto extends ApiResponseDto {
  token: string;
  expirationTime: number;
}