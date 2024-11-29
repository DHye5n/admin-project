import ApiResponseDto from '../ApiResponse.dto';

export default interface SignUpResponseDto extends ApiResponseDto{
  email: string;
  username: string;
}
