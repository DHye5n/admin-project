package dh.project.backend.dto.response.board;

import dh.project.backend.domain.BoardEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class PutLikeResponseDto {

    private final Long boardId;
    private final boolean liking;

    @Builder
    public PutLikeResponseDto(Long boardId, boolean liking) {
        this.boardId = boardId;
        this.liking = liking;
    }

    public static PutLikeResponseDto fromEntity(BoardEntity board, boolean liking) {
        return PutLikeResponseDto.builder()
                .boardId(board.getBoardId())
                .liking(liking)
                .build();
    }
}
