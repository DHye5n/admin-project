import ApiResponseDto from '../ApiResponse.dto';

export default interface DeleteBoardResponseDTO extends ApiResponseDto {
  boardId: number;
}