package dh.project.backend.dto.response.board;

import dh.project.backend.dto.object.BoardListItem;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class GetTop3BoardListResponseDto {

    private final List<BoardListItem> top3List;

    @Builder
    public GetTop3BoardListResponseDto(List<BoardListItem> top3List) {
        this.top3List = top3List;
    }
}
