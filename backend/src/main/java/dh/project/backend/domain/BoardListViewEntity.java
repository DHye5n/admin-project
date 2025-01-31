package dh.project.backend.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Immutable
@Table(name = "board_list_view")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity(name = "board_list_view")
public class BoardListViewEntity {

    @Id
    private Long boardId;

    @Column(length = 50)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;

    private String titleImage;

    private int likeCount;

    private int commentCount;

    private int viewCount;

    private String createdDate;

    @Column(length = 10)
    private String username;

    private String profileImage;

    @Builder
    public BoardListViewEntity(Long boardId, String title, String content, String titleImage, int likeCount,
                               int commentCount, int viewCount, String createdDate,
                               String username, String profileImage) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.titleImage = titleImage;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.viewCount = viewCount;
        this.createdDate = createdDate;
        this.username = username;
        this.profileImage = profileImage;
    }

    public static BoardListViewEntity fromEntity(BoardEntity board) {

        String titleImage = board.getImages().isEmpty() ? null : board.getImages().get(0).getImageUrl();

        return BoardListViewEntity.builder()
                .boardId(board.getBoardId())
                .title(board.getTitle())
                .content(board.getContent())
                .titleImage(titleImage)
                .likeCount(board.getLikeCount())
                .commentCount(board.getCommentCount())
                .viewCount(board.getViewCount())
                .createdDate(board.getCreatedDate())
                .username(board.getUser().getUsername())
                .profileImage(board.getUser().getProfileImage())
                .build();
    }

}
