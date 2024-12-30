package dh.project.backend.dto.response.board;

import dh.project.backend.dto.object.BoardListItem;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class GetLatestBoardListResponseDto {

    private final List<BoardListItem> boardListItems;

    @Builder
    public GetLatestBoardListResponseDto(List<BoardListItem> boardListItems) {
        this.boardListItems = boardListItems;
    }
}
