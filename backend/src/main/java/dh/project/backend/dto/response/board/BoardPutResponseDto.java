package dh.project.backend.dto.response.board;

import dh.project.backend.domain.BoardEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class BoardPutResponseDto {

    private final Long boardId;
    private final boolean isLiking;

    @Builder
    public BoardPutResponseDto(Long boardId, boolean isLiking) {
        this.boardId = boardId;
        this.isLiking = isLiking;
    }

    public static BoardPutResponseDto fromEntity(BoardEntity board, boolean isLiking) {
        return BoardPutResponseDto.builder()
                .boardId(board.getBoardId())
                .isLiking(isLiking)
                .build();
    }
}
