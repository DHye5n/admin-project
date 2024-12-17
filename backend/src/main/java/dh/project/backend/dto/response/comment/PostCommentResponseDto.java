package dh.project.backend.dto.response.comment;

import dh.project.backend.domain.CommentEntity;
import dh.project.backend.dto.response.user.SignInUserResponseDto;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PostCommentResponseDto {

    private final String comment;
    private final SignInUserResponseDto writer;
    private final LocalDateTime createdDate;

    @Builder
    public PostCommentResponseDto(String comment, SignInUserResponseDto writer, LocalDateTime createdDate) {
        this.comment = comment;
        this.writer = writer;
        this.createdDate = createdDate;
    }

    public static PostCommentResponseDto fromEntity(CommentEntity comment) {
        SignInUserResponseDto writerDto = SignInUserResponseDto.fromEntity(comment.getUser());

        return PostCommentResponseDto.builder()
                .comment(comment.getComment())
                .writer(writerDto)
                .createdDate(comment.getCreatedDate())
                .build();
    }
}
