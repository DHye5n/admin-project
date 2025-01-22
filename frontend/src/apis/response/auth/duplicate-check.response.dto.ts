import ApiResponseDto from '../ApiResponse.dto';

export default interface DuplicateCheckResponseDto extends ApiResponseDto {
  exists: boolean;
}