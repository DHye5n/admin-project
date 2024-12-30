package dh.project.backend.dto.object;

import dh.project.backend.domain.BoardListViewEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

/**
 *  공통 객체 DTO 클래스
 * */

@Getter
@NoArgsConstructor
public class BoardListItem {

    private Long boardId;
    private String title;
    private String content;
    private String boardTitleImage;
    private int likeCount;
    private int commentCount;
    private int viewCount;
    private String createdDate;
    private String modifiedDate;
    private String username;
    private String profileImage;

    @Builder
    public BoardListItem(Long boardId, String title, String content,
                         String boardTitleImage, int likeCount, int commentCount,
                         int viewCount, String createdDate, String modifiedDate,
                         String username, String profileImage) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.boardTitleImage = boardTitleImage;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.viewCount = viewCount;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.username = username;
        this.profileImage = profileImage;
    }

    public static List<BoardListItem> fromEntityList(List<BoardListViewEntity> boards) {
        return boards.stream()
                .map(board -> BoardListItem.builder()
                        .boardId(board.getBoardId())
                        .title(board.getTitle())
                        .content(board.getContent())
                        .boardTitleImage(board.getTitleImage())
                        .likeCount(board.getLikeCount())
                        .commentCount(board.getCommentCount())
                        .viewCount(board.getViewCount())
                        .createdDate(board.getCreatedDate())
                        .username(board.getUsername())
                        .profileImage(board.getProfileImage())
                        .build())
                .collect(Collectors.toList());
    }

}
