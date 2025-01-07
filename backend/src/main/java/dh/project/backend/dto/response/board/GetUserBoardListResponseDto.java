package dh.project.backend.dto.response.board;

import dh.project.backend.dto.object.BoardListItem;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class GetUserBoardListResponseDto {

    private final List<BoardListItem> userBoardList;

    @Builder
    public GetUserBoardListResponseDto(List<BoardListItem> userBoardList) {
        this.userBoardList = userBoardList;
    }
}
