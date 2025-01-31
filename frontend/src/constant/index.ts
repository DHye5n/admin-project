export const MAIN_PATH = () => '/dashboard';
export const AUTH_PATH = () => '/auth';
export const SEARCH_PATH = (searchWord: string) => `/search/${searchWord}`;
export const USER_PATH = (userId: number | string) => `/users/profile/${userId}`;
export const BOARD_PATH = () => '/boards';
export const BOARD_WRITE_PATH = () => 'write';
export const BOARD_READ_PATH = () => 'list';
export const BOARD_DETAIL_PATH = (boardId: string | number) =>
  `detail/${boardId}`;
export const BOARD_UPDATE_PATH = (boardId: string | number) =>
  `update/${boardId}`;

