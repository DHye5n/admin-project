import { SignInRequestDto, SignUpRequestDto } from './request/auth';
import axios from 'axios';
import { UserCheckResponseDto, SignInResponseDto, SignUpResponseDto } from './response/auth';
import { ApiResponseDto } from './response';
import {
  GetAllUserListResponseDto,
  GetUserResponseDto, PatchPasswordResponseDto,
  PatchUserResponseDto, PutFollowResponseDto,
  SignInUserResponseDto,
} from './response/user';
import {
  PostBoardResponseDto,
  GetBoardResponseDto,
  ViewCountResponseDto,
  GetLikeListResponseDto,
  PutLikeResponseDto,
  DeleteBoardResponseDto,
  PatchBoardResponseDto,
  GetLatestBoardListResponseDto,
  GetTop3BoardListResponseDto,
  GetSearchBoardListResponseDto,
  GetUserBoardListResponseDto,
} from './response/board';
import { PatchBoardRequestDTO, PostBoardRequestDto } from './request/board';
import PostCommentRequestDto from './request/comment/post-comment.request.dto';
import PostCommentResponseDto from './response/comment/post-comment.response.dto';
import { GetPopularListResponseDto, GetRelationListResponseDto } from './response/search';
import { PatchPasswordRequestDto, PatchUserRequestDto } from './request/user';
import GetAllBoardListResponseDto from './response/board/get-all-board-list.response.dto';
import PatchCommentRequestDto from './request/comment/patch-comment.request.dto';
import { DeleteCommentResponseDto, GetCommentListResponseDto, PatchCommentResponseDto } from './response/comment';


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

const VIEW_COUNT_URL = (boardId: number | string) => `${API_DOMAIN}/boards/${boardId}/view-counts`;

const POST_COMMENT_URL = (boardId: number | string) => `${API_DOMAIN}/comments/${boardId}/comment`;

const FILE_DOMAIN = `${DOMAIN}/files`;

const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;



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


/**
 *   TODO: Auth 요청
 * */

// 로그인
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
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
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
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
const CHECK_EMAIL_URL = (email: string) => `${API_DOMAIN}/auth/check-email?email=${email}`;
export const checkEmailExists = async (email: string): Promise<ApiResponseDto<UserCheckResponseDto> | null> => {
  const result = await axios.get(CHECK_EMAIL_URL(email))
    .then(response => {
      const responseBody: ApiResponseDto<UserCheckResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<UserCheckResponseDto> = error.response.data;
      return responseBody;
    });
  return result;
};

// 아이디 중복 체크
const DUPLICATE_USERNAME_URL = (username: string) => `${API_DOMAIN}/auth/username/${encodeURIComponent(username)}/duplicates`;
export const duplicateUsernameCheck = async (username: string): Promise<ApiResponseDto<UserCheckResponseDto> | null> => {
  const result = await axios.get(DUPLICATE_USERNAME_URL(username))
    .then(response => {
      const responseBody: ApiResponseDto<UserCheckResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<UserCheckResponseDto> = error.response.data;
      return responseBody;
    });
  return result;
};

// 아이디 존재 여부 체크
const EXIST_USERNAME_URL = (username: string) => `${API_DOMAIN}/auth/username/${encodeURIComponent(username)}/exists`;
export const existUsernameCheck = async (username: string): Promise<ApiResponseDto<UserCheckResponseDto> | null> => {
  const result = await axios.get(EXIST_USERNAME_URL(username))
    .then(response => {
      const responseBody: ApiResponseDto<UserCheckResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<UserCheckResponseDto> = error.response.data;
      return responseBody;
    });
  return result;
};

// 인증 코드 발송 요청
const SEND_VERIFICATION_CODE_URL = (email: string) => `${API_DOMAIN}/auth/send-verification-code?email=${email}`;
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
const RESEND_VERIFICATION_CODE_URL = (email: string) => `${API_DOMAIN}/auth/resend-verification-code?email=${email}`;
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
const VERIFY_CODE_URL = () => `${API_DOMAIN}/auth/verify-code`;
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

/**
 *   TODO: Get 요청
 * */

// 게시물 상세
const GET_BOARD_URL = (boardId: number | string) => `${API_DOMAIN}/boards/${boardId}`;
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

// 최신 게시물 목록
const GET_LATEST_BOARD_LIST_URL = () => `${API_DOMAIN}/boards/latest-list`;
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

// 모든 게시물 목록
const GET_BOARD_LIST_URL = () => `${API_DOMAIN}/boards/list`;
export const getAllBoardListRequest = async (accessToken: string) => {
  const result = await axios.get(GET_BOARD_LIST_URL(), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<GetAllBoardListResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<GetAllBoardListResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

// Top3 게시물 목록
const GET_TOP3_BOARD_LIST_URL = () => `${API_DOMAIN}/boards/top3-list`;
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

// 검색 게시물 목록
const GET_SEARCH_BOARD_LIST_URL = (searchWord: string, preSearchWord: string | null) => `${API_DOMAIN}/boards/searches/${searchWord}${preSearchWord ? '/' + preSearchWord : ''}`;
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

// 인기 검색어 목록 
const GET_POPULAR_LIST_URL = () => `${API_DOMAIN}/searches/populars`;
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

// 연관 검색어 목록
const GET_RELATION_LIST_URL = (searchWord: string) => `${API_DOMAIN}/searches/${searchWord}/relations`;
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

// 유저 게시물 목록
const GET_USER_BOARD_LIST_URL = (userId: number | string) => `${API_DOMAIN}/boards/user-board-list/${userId}`;
export const getUserBoardListRequest = async (userId: number | string, accessToken: string) => {
  const result = await axios.get(GET_USER_BOARD_LIST_URL(userId), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<GetUserBoardListResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<GetUserBoardListResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

// 유저 정보
const GET_USER_URL = (userId: number | string) => `${API_DOMAIN}/users/${userId}`;
export const getUserRequest = async (userId: number | string, accessToken: string) => {
  const result = await axios.get(GET_USER_URL(userId), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<GetUserResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<GetUserResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

// 로그인 유저 정보
const SIGN_IN_USER_URL = () => `${API_DOMAIN}/users`;
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

// 유저 리스트
const GET_USER_LIST_URL = () => `${API_DOMAIN}/users/list`;
export const getAllUserListRequest = async (accessToken: string) => {
  const result = await axios.get(GET_USER_LIST_URL(), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<GetAllUserListResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<GetAllUserListResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
}

// 좋아요 리스트
const GET_LIKE_LIST_URL = (boardId: number | string) => `${API_DOMAIN}/boards/${boardId}/likes`;
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

// 댓글 리스트
const GET_COMMENT_LIST_URL = (boardId: number | string) => `${API_DOMAIN}/comments/${boardId}/comment-list`;
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

/**
 *   TODO: Post 요청
 * */

// 게시물 작성
const POST_BOARD_URL = () => `${API_DOMAIN}/boards`;
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

// 비밀번호 찾기(유저 정보) 검증
const FIND_PASSWORD_URL = () => `${API_DOMAIN}/auth/find-password`;
export const findPasswordRequest = async (email: string, username: string, verificationCode: string): Promise<ApiResponseDto<boolean> | null> => {
  const requestBody = { email, username, verificationCode };
  const result = await axios.post(FIND_PASSWORD_URL(), requestBody)
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

// 아이디 찾기(유저 정보) 검증
const FIND_USERNAME_URL = () => `${API_DOMAIN}/auth/find-username`;
export const findUsernameRequest = async (email: string, verificationCode: string): Promise<ApiResponseDto<boolean> | null> => {
  const requestBody = { email, verificationCode };
  const result = await axios.post(FIND_USERNAME_URL(), requestBody)
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

// 댓글 작성
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

/**
 *   TODO: Patch 요청
 * */

// 게시물 수정
const PATCH_BOARD_URL = (boardId: number | string) => `${API_DOMAIN}/boards/${boardId}`;
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

// 프로필 수정
const PATCH_USER_URL = (userId: number | string) => `${API_DOMAIN}/users/profile/${userId}`;
export const patchUserRequest = async (userId: number | string, requestBody: PatchUserRequestDto, accessToken: string) => {
  const result = await axios.patch(PATCH_USER_URL(userId), requestBody, authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<PatchUserResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<PatchUserResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

// 비밀번호 변경
const PATCH_PASSWORD_URL = (userId: number | string) => `${API_DOMAIN}/users/password/${userId}`;
export const patchPasswordRequest = async (userId: number | string, requestBody: PatchPasswordRequestDto, accessToken: string) => {
  const result = await axios.patch(PATCH_PASSWORD_URL(userId), requestBody, authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<PatchPasswordResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<PatchPasswordResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

// 댓글 수정
const PATCH_COMMENT_URL = (boardId: number | string, commentId: number | string) => `${API_DOMAIN}/comments/${boardId}/${commentId}`;
export const patchCommentRequest = async (boardId: number | string, commentId: number | string, requestBody: PatchCommentRequestDto, accessToken: string) => {
  const result = await axios.patch(PATCH_COMMENT_URL(boardId, commentId), requestBody, authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<PatchCommentResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<PatchCommentResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

/**
 *   TODO: Put 요청
 * */
// 좋아요
const PUT_LIKE_URL = (boardId: number | string) => `${API_DOMAIN}/boards/${boardId}/like`;
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

// 팔로우
const PUT_FOLLOW_URL = (userId: number | string) => `${API_DOMAIN}/users/follows/${userId}`;
export const putFollowRequest = async (userId: number | string, accessToken: string) => {
  const result = await axios.put(PUT_FOLLOW_URL(userId), {}, authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<PutFollowResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<PutFollowResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};

/**
 *   TODO: Delete 요청
 * */

// 게시물 삭제
const DELETE_BOARD_URL = (boardId: number | string) => `${API_DOMAIN}/boards/${boardId}`;
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

// 댓글 삭제
const DELETE_COMMENT_URL = (boardId: number | string, commentId: number | string) => `${API_DOMAIN}/comments/${boardId}/${commentId}`;
export const deleteCommentRequest = async (boardId: number | string, commentId: number | string, accessToken: string) => {
  const result = await axios.delete(DELETE_COMMENT_URL(boardId, commentId), authorization(accessToken))
    .then(response => {
      const responseBody: ApiResponseDto<DeleteCommentResponseDto> = response.data;
      return responseBody;
    })
    .catch(error => {
      if (!error.response) return null;
      const responseBody: ApiResponseDto<DeleteCommentResponseDto> = error.response.data;
      return responseBody;
    })
  return result;
};