package dh.project.backend.dto.object;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
    private LocalDateTime createdAt;
    private String username;
    private String profileImage;

    @Builder
    public BoardListItem(Long boardId, String title, String content,
                         String boardTitleImage, int likeCount, int commentCount,
                         int viewCount, LocalDateTime createdAt, String username, String profileImage) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.boardTitleImage = boardTitleImage;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.viewCount = viewCount;
        this.createdAt = createdAt;
        this.username = username;
        this.profileImage = profileImage;
    }

}
