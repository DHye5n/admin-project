package dh.project.backend.dto.response.board;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.ImageEntity;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PatchBoardResponseDto {

    private final Long boardId;
    private final String title;
    private final String content;
    private final List<String> boardImageList;


    @Builder
    public PatchBoardResponseDto(Long boardId, String title, String content, List<String> boardImageList) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.boardImageList = boardImageList;
    }

    public static PatchBoardResponseDto fromEntity(BoardEntity board) {
        return PatchBoardResponseDto.builder()
                .boardId(board.getBoardId())
                .title(board.getTitle())
                .content(board.getContent())
                .boardImageList(board.getImages().stream()
                        .map(ImageEntity::getImageUrl)
                        .collect(Collectors.toList()))
                .build();
    }
}
