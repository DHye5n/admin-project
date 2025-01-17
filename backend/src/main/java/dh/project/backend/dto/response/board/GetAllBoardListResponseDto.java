package dh.project.backend.dto.response.board;

import dh.project.backend.dto.object.BoardListItem;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class GetAllBoardListResponseDto {

    private final List<BoardListItem> boardList;

    @Builder
    public GetAllBoardListResponseDto(List<BoardListItem> boardList) {
        this.boardList = boardList;
    }
}
