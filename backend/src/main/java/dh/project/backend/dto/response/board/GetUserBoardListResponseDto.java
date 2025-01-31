package dh.project.backend.dto.response.board;

import dh.project.backend.dto.object.BoardListItem;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class GetUserBoardListResponseDto {

    private final List<BoardListItem> userBoardList;
    private final Long userId;

    @Builder
    public GetUserBoardListResponseDto(List<BoardListItem> userBoardList, Long userId) {
        this.userBoardList = userBoardList;
        this.userId = userId;
    }
}
