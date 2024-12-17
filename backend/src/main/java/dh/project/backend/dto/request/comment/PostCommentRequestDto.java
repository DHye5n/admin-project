package dh.project.backend.dto.request.comment;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.CommentEntity;
import dh.project.backend.domain.UserEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostCommentRequestDto {

    @NotBlank
    private String comment;

    @Builder
    public PostCommentRequestDto(String comment) {
        this.comment = comment;
    }

    public CommentEntity toEntity(UserEntity user, BoardEntity board) {
        return CommentEntity.builder()
                .comment(comment)
                .user(user)
                .board(board)
                .build();
    }
}
