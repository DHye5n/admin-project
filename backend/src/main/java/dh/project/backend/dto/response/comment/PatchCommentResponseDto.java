package dh.project.backend.dto.response.comment;

import dh.project.backend.domain.CommentEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class PatchCommentResponseDto {

    private final Long commentId;
    private final String comment;



    @Builder
    public PatchCommentResponseDto(Long commentId, String comment) {
        this.commentId = commentId;
        this.comment = comment;
    }

    public static PatchCommentResponseDto fromEntity(CommentEntity comment) {
        return PatchCommentResponseDto.builder()
                .commentId(comment.getCommentId())
                .comment(comment.getComment())
                .build();
    }
}
