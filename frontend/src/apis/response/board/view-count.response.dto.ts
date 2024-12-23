import ApiResponseDto from '../ApiResponse.dto';

export default interface ViewCountResponseDTO extends ApiResponseDto {
  boardId: string;
  viewCount: number;
}