export default interface BoardListItem {

    boardId: bigint;
    title: string;
    content: string;
    boardTitleImage: string | null;
    likeCount: number;
    commentCount: number;
    viewCount: number;
    createdAt: string;
    username: string;
    profileImage: string | null;

}