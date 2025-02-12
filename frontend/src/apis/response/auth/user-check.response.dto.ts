import ApiResponseDto from '../ApiResponse.dto';

export default interface UserCheckResponseDto extends ApiResponseDto {
  exists: boolean;
}