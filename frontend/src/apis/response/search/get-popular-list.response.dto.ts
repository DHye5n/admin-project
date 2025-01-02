import ApiResponseDto from '../ApiResponse.dto';

export default interface GetPopularListResponseDto extends ApiResponseDto {
  popularWordList: string[];
}