import ApiResponseDto from '../ApiResponse.dto';

export default interface PostMessageResponseDto extends ApiResponseDto {
  message: string;
  sender: string;
}