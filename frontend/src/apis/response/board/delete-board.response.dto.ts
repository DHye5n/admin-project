import ApiResponseDto from '../ApiResponse.dto';

export default interface DeleteBoardResponseDto extends ApiResponseDto {
  boardId: number;
}