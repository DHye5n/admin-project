package dh.project.backend.dto.response.board;

import dh.project.backend.domain.BoardEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class PutBoardResponseDto {

    private final Long boardId;
    private final boolean isLiking;

    @Builder
    public PutBoardResponseDto(Long boardId, boolean isLiking) {
        this.boardId = boardId;
        this.isLiking = isLiking;
    }

    public static PutBoardResponseDto fromEntity(BoardEntity board, boolean isLiking) {
        return PutBoardResponseDto.builder()
                .boardId(board.getBoardId())
                .isLiking(isLiking)
                .build();
    }
}
