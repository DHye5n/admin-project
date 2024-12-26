import ApiResponseDto from '../ApiResponse.dto';

export default interface PatchBoardResponseDto extends ApiResponseDto {
  boardId: number;
  title: string;
  content: string;
  boardImageList: string[];
}