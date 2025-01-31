import ApiResponseDto from '../ApiResponse.dto';

export default interface PutFollowResponseDto extends ApiResponseDto {
  followId: number;
  username: string;
  following: boolean;
}