package dh.project.backend.dto.response.board;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.ImageEntity;
import dh.project.backend.dto.response.user.SignInUserResponseDto;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PostBoardResponseDto {

    private final String title;
    private final String content;
    private final SignInUserResponseDto writer;
    private final List<String> boardImageList;
    private final LocalDateTime createdDate;
    private final LocalDateTime modifiedDate;


    @Builder
    public PostBoardResponseDto(String title, String content, SignInUserResponseDto writer,
                                List<String> boardImageList, LocalDateTime createdDate, LocalDateTime modifiedDate) {
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.boardImageList = boardImageList;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
    }

    public static PostBoardResponseDto fromEntity(BoardEntity board) {
        SignInUserResponseDto writerDto = SignInUserResponseDto.fromEntity(board.getUser());

        return PostBoardResponseDto.builder()
                .title(board.getTitle())
                .content(board.getContent())
                .writer(writerDto)
                .boardImageList(board.getImages().stream()
                        .map(ImageEntity::getImageUrl)
                        .collect(Collectors.toList()))
                .createdDate(board.getCreatedDate())
                .modifiedDate(board.getModifiedDate())
                .build();
    }
}
