export const MAIN_PATH = () => '/';
export const AUTH_PATH = () => '/auth';
export const SEARCH_PATH = (searchWord: string) => `/search/${searchWord}`;
export const USER_PATH = (email: string) => `/user/${email}`;
export const BOARD_PATH = () => '/board';
export const BOARD_WRITE_PATH = () => 'write';
export const BOARD_DETAIL_PATH = (boardId: string | number) =>
  `detail/${boardId}`;
export const BOARD_UPDATE_PATH = (boardId: string | number) =>
  `update/${boardId}`;
