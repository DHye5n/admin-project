import { SignInRequestDto, SignUpRequestDto } from './request/auth';
import axios from 'axios';
import { DuplicateCheckResponseDto, SignInResponseDto, SignUpResponseDto } from './response/auth';
import { ApiResponseDto } from './response';
import { SignInUserResponseDto } from './response/user';
import {
  PostBoardResponseDto,
  GetBoardResponseDto,
  ViewCountResponseDto,
  GetLikeListResponseDto,
  GetCommentListResponseDto,
  PutLikeResponseDto,
  DeleteBoardResponseDto,
  PatchBoardResponseDto,
  GetLatestBoardListResponseDto, GetTop3BoardListResponseDto, GetSearchBoardListResponseDto,
} from './response/board';
import { PatchBoardRequestDTO, PostBoardRequestDto } from './request/board';
import PostCommentRequestDto from './request/comment/post-comment.request.dto';
import PostCommentResponseDto from './response/comment/post-comment.response.dto';
import { GetPopularListResponseDto, GetRelationListResponseDto } from './response/search';


const DOMAIN = 'http://localhost:9994';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: string) => {
  return {
    headers: { Authorization: `Bearer ${accessToken}` }
  }
};

const multipartFormData = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
};

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;

const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

const CHECK_EMAIL_URL = (email: string) => `${API_DOMAIN}/auth/check-email?email=${email}`;

const CHECK_USERNAME_URL = (username: string) => `${API_DOMAIN}/auth/username/${encodeURIComponent(username)}/exists`;

const SEND_VERIFICATION_CODE_URL = (email: string) => `${API_DOMAIN}/auth/send-verification-code?email=${email}`;

const RESEND_VERIFICATION_CODE_URL = (email: string) => `${API_DOMAIN}/auth/resend-verification-code?email=${email}`;

const VERIFY_CODE_URL = () => `${API_DOMAIN}/auth/verify-code`;

const SIGN_IN_USER_URL = () => `${API_DOMAIN}/users`;

const POST_BOARD_URL = () => `${API_DOMAIN}/boards`;

const GET_BOARD_URL = (boardId: number | string) => `${API_DOMAIN}/boards/${boardId}`;

const PATCH_BOARD_URL = (boardId: number | string) => `${API_DOMAIN}/boards/${boardId}`;

const DELETE_BOARD_URL = (boardId: number | string) => `${API_DOMAIN}/boards/${boardId}`;

const VIEW_COUNT_URL = (boardId: number | string) => `${API_DOMAIN}/boards/${boardId}/view-counts`;

const GET_LIKE_LIST_URL = (boardId: number | string) => `${API_DOMAIN}/boards/${boardId}/likes`;

const GET_COMMENT_LIST_URL = (boardId: number | string) => `${API_DOMAIN}/comments/${boardId}/comments`;

const PUT_LIKE_URL = (boardId: number | string) => `${API_DOMAIN}/boards/${boardId}/like`

const POST_COMMENT_URL = (boardId: number | string) => `${API_DOMAIN}/comments/${boardId}/comment`;

const GET_LATEST_BOARD_LIST_URL = () => `${API_DOMAIN}/boards/latest-lists`;

const GET_TOP3_BOARD_LIST_URL = () => `${API_DOMAIN}/boards/top3-lists`;

const GET_POPULAR_LIST_URL = () => `${API_DOMAIN}/searches/populars`;

const GET_SEARCH_BOARD_LIST_URL = (searchWord: string, preSearchWord: string | null) => `${API_DOMAIN}/boards/searches/${searchWord}${preSearchWord ? '/' + preSearchWord : ''}`;

const GET_RELATION_LIST_URL = (searchWord: string) => `${API_DOMAIN}/searches/${searchWord}/relations`;

const FILE_DOMAIN = `${DOMAIN}/files`;

const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;

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
};

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
};

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
};

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
};

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
};

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
};

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
};

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
};

// 게시물 작성
export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string): Promise<ApiResponseDto<PostBoardResponseDto> | null> => {
  const result = await axios.post(POST_BOARD_URL(), requestBody, authorization(accessToken))
    .then(response => {
      const responseBody: PostBoardResponseDto = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<PostBoardResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

export const deleteBoardRequest = async (boardId: number | string, accessToken: string) => {
  const result = await axios.delete(DELETE_BOARD_URL(boardId), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<DeleteBoardResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<DeleteBoardResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

// 파일 업로드
export const fileUploadRequest = async (data: FormData, accessToken: string) => {

  const headers = {
    ...multipartFormData.headers,
    ...authorization(accessToken).headers
  };

  const result = await axios.post(FILE_UPLOAD_URL(), data, { headers })
    .then(response => {
      const responseBody: ApiResponseDto<string> = response.data;
      return responseBody;
    })
    .catch(error => {
      return null;
    })
  return result;
};

// 게시물 상세
export const getBoardRequest = async (boardId: number | string, accessToken: string) => {
  const result = await axios.get(GET_BOARD_URL(boardId), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<GetBoardResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<GetBoardResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

export const viewCountRequest = async (boardId: number | string, accessToken: string) => {
  const result = await axios.get(VIEW_COUNT_URL(boardId), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<ViewCountResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<ViewCountResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

export const getLikeListRequest = async (boardId: number | string, accessToken: string) => {
  const result = await axios.get(GET_LIKE_LIST_URL(boardId), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<GetLikeListResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<GetLikeListResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

export const getCommentListRequest = async (boardId: number | string, accessToken: string) => {
  const result = await axios.get(GET_COMMENT_LIST_URL(boardId), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<GetCommentListResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<GetCommentListResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

export const putLikeRequest = async (boardId: number | string, accessToken: string) => {
  const result = await axios.put(PUT_LIKE_URL(boardId), {}, authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<PutLikeResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<PutLikeResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

export const postCommentRequest = async (boardId: number | string, requestBody: PostCommentRequestDto, accessToken: string) => {
  const result = await axios.post(POST_COMMENT_URL(boardId), requestBody, authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<PostCommentResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<PostCommentResponseDto> = error.response.data;
      return responseBody;
    })
    return result;
};

export const patchBoardRequest = async (boardId: number | string, requestBody: PatchBoardRequestDTO, accessToken: string) => {
  const result = await axios.patch(PATCH_BOARD_URL(boardId), requestBody, authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<PatchBoardResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<PatchBoardResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

export const getLatestBoardListRequest = async (accessToken: string) => {
  const result = await axios.get(GET_LATEST_BOARD_LIST_URL(), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<GetLatestBoardListResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<GetLatestBoardListResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

export const getTop3BoardListRequest = async (accessToken: string) => {
  const result = await axios.get(GET_TOP3_BOARD_LIST_URL(), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<GetTop3BoardListResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<GetTop3BoardListResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

export const getPopularListRequest = async (accessToken: string) => {
  const result = await axios.get(GET_POPULAR_LIST_URL(), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<GetPopularListResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<GetPopularListResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

export const getSearchBoardListRequest = async (searchWord: string, preSearchWord: string | null, accessToken: string) => {
  const result = await axios.get(GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<GetSearchBoardListResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<GetSearchBoardListResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

export const getRelationListRequest = async (searchWord: string, accessToken: string) => {
  const result = await axios.get(GET_RELATION_LIST_URL(searchWord), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<GetRelationListResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<GetRelationListResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};