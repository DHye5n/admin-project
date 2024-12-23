package dh.project.backend.dto.response.board;

import dh.project.backend.domain.BoardEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ViewCountResponseDto {

    private final Long boardId;
    private final int viewCount;

    @Builder
    public ViewCountResponseDto(Long boardId, int viewCount) {
        this.boardId = boardId;
        this.viewCount = viewCount;
    }

    public static ViewCountResponseDto fromEntity(BoardEntity board) {
        return ViewCountResponseDto.builder()
                .boardId(board.getBoardId())
                .viewCount(board.getViewCount())
                .build();
    }
}
