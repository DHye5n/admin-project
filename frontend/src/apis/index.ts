import { SignInRequestDto, SignUpRequestDto } from './request/auth';
import axios from 'axios';
import { DuplicateCheckResponseDto, SignInResponseDto, SignUpResponseDto } from './response/auth';
import { ApiResponseDto } from './response';
import { SignInUserResponseDto } from './response/user';

const DOMAIN = 'http://localhost:9994';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: string) => {
  return {
    headers: { Authorization: `Bearer ${accessToken}` }
  }
};

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;

const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

const CHECK_EMAIL_URL = (email: string) => `${API_DOMAIN}/auth/check-email?email=${email}`;

const CHECK_USERNAME_URL = (username: string) => `${API_DOMAIN}/auth/username/${encodeURIComponent(username)}/exists`;

const SEND_VERIFICATION_CODE_URL = (email: string) => `${API_DOMAIN}/auth/send-verification-code?email=${email}`;

const RESEND_VERIFICATION_CODE_URL = (email: string) => `${API_DOMAIN}/auth/resend-verification-code?email=${email}`;

const VERIFY_CODE_URL = () => `${API_DOMAIN}/auth/verify-code`;

const SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;

// 로그인
export const signInRequest = async (requestBody: SignInRequestDto) => {
  const result = await axios.post(SIGN_IN_URL(), requestBody)
    .then(response => {
      const responseBody: SignInResponseDto = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto = error.response.data;
      return responseBody;
    });
  return result;
}

// 회원가입
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
  const result = await axios.post(SIGN_UP_URL(), requestBody)
    .then(response => {
      const responseBody: SignUpResponseDto = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto = error.response.data;
      return responseBody;
    });
  return result;
}

// 이메일 중복 체크
export const checkEmailExists = async (email: string): Promise<ApiResponseDto<DuplicateCheckResponseDto> | null> => {
  const result = await axios.get(CHECK_EMAIL_URL(email))
    .then(response => {
      const responseBody: ApiResponseDto<DuplicateCheckResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<DuplicateCheckResponseDto> = error.response.data;
      return responseBody;
    });
  return result;
}

// 아이디 중복 체크
export const checkUsernameExists = async (username: string): Promise<ApiResponseDto<DuplicateCheckResponseDto> | null> => {
  const result = await axios.get(CHECK_USERNAME_URL(username))
    .then(response => {
      const responseBody: ApiResponseDto<DuplicateCheckResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<DuplicateCheckResponseDto> = error.response.data;
      return responseBody;
    });
  return result;
}

// 인증 코드 발송 요청
export const sendVerificationCode = async (email: string): Promise<ApiResponseDto<string> | null> => {
  const result = await axios.post(SEND_VERIFICATION_CODE_URL(email))
    .then(response => {
      const responseBody: ApiResponseDto<string> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<string> = error.response.data;
      return responseBody;
    });
  return result;
}

// 인증 코드 재발송 요청
export const resendVerificationCode = async (email: string): Promise<ApiResponseDto<string> | null> => {
  const result = await axios.post(RESEND_VERIFICATION_CODE_URL(email))
    .then(response => {
      const responseBody: ApiResponseDto<string> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<string> = error.response.data;
      return responseBody;
    });
  return result;
}

// 인증 코드 검증 요청
export const verifyCode = async (email: string, verificationCode: string): Promise<ApiResponseDto<boolean> | null> => {
  const requestBody = { email, verificationCode };
  const result = await axios.post(VERIFY_CODE_URL(), requestBody)
    .then(response => {
      const responseBody: ApiResponseDto<boolean> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<boolean> = error.response.data;
      return responseBody;
    });
  return result;
}

// 유저 정보 반환
export const signInUserRequest = async (accessToken: string): Promise<ApiResponseDto<SignInUserResponseDto> | null> => {
  const result = await axios.get(SIGN_IN_USER_URL(), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<SignInUserResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<SignInUserResponseDto> = error.response.data;
      return responseBody;
    });
  return result;
}