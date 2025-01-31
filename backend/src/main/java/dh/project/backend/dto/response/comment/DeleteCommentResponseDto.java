package dh.project.backend.dto.response.comment;

import dh.project.backend.domain.CommentEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class DeleteCommentResponseDto {

    private final Long commentId;


    @Builder
    public DeleteCommentResponseDto(Long commentId) {
        this.commentId = commentId;
    }

    public static DeleteCommentResponseDto fromEntity(CommentEntity comment) {
        return DeleteCommentResponseDto.builder()
                .commentId(comment.getCommentId())
                .build();
    }
}
