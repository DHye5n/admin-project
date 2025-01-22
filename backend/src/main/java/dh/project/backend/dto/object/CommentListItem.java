package dh.project.backend.dto.object;

import dh.project.backend.domain.CommentEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


/**
 *  공통 객체 DTO 클래스
 * */

@Getter
@NoArgsConstructor
public class CommentListItem {

    private Long commentId;
    private String username;
    private String profileImage;
    private String comment;
    private String createdDate;
    private String modifiedDate;

    @Builder
    public CommentListItem(Long commentId, String username, String profileImage, String comment, String createdDate, String modifiedDate) {
        this.commentId = commentId;
        this.username = username;
        this.profileImage = profileImage;
        this.comment = comment;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
    }

    public static CommentListItem fromEntity(CommentEntity comment) {
        return CommentListItem.builder()
                .commentId(comment.getCommentId())
                .username(comment.getUser().getUsername())
                .profileImage(comment.getUser().getProfileImage())
                .comment(comment.getComment())
                .createdDate(comment.getCreatedDate())
                .modifiedDate(comment.getModifiedDate())
                .build();
    }
}
