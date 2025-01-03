package dh.project.backend.dto.response.board;

import dh.project.backend.dto.object.BoardListItem;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class GetSearchBoardListResponseDto {

    private final List<BoardListItem> searchList;

    @Builder
    public GetSearchBoardListResponseDto(List<BoardListItem> searchList) {
        this.searchList = searchList;
    }
}
