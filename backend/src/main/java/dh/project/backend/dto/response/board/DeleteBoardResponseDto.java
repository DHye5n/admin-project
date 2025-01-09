package dh.project.backend.dto.response.board;

import dh.project.backend.domain.BoardEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class DeleteBoardResponseDto {

    private final Long boardId;


    @Builder
    public DeleteBoardResponseDto(Long boardId, boolean deleted) {
        this.boardId = boardId;
    }

    public static DeleteBoardResponseDto fromEntity(BoardEntity board) {
        return DeleteBoardResponseDto.builder()
                .boardId(board.getBoardId())
                .build();
    }
}
