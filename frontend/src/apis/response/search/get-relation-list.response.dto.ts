import ApiResponseDto from '../ApiResponse.dto';

export default interface GetRelationListResponseDto extends ApiResponseDto {
  relationWordList: string[];
}