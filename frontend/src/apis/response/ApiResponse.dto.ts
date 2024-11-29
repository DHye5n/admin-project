import { ResponseStatus } from 'types/enum';

export default interface ApiResponseDto<T = null> {
  success: boolean;
  status: ResponseStatus;
  message: string;
  data?: T | null;
  code: ResponseStatus;
}
