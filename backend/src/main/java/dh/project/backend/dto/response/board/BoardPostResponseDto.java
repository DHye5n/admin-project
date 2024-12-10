package dh.project.backend.dto.response.board;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.dto.response.user.SignInUserResponseDto;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BoardPostResponseDto {

    private final String title;
    private final String content;
    private final SignInUserResponseDto writer;
    private final LocalDateTime createdDate;
    private final LocalDateTime modifiedDate;

    @Builder
    public BoardPostResponseDto(String title, String content, SignInUserResponseDto writer, LocalDateTime createdDate, LocalDateTime modifiedDate) {
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
    }

    public static BoardPostResponseDto fromEntity(BoardEntity board) {
        SignInUserResponseDto writerDto = SignInUserResponseDto.fromEntity(board.getUser());

        return BoardPostResponseDto.builder()
                .title(board.getTitle())
                .content(board.getContent())
                .writer(writerDto)
                .createdDate(board.getCreatedDate())
                .modifiedDate(board.getModifiedDate())
                .build();
    }
}
