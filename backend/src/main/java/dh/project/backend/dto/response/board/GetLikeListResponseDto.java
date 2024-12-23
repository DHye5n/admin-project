package dh.project.backend.dto.response.board;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.LikeEntity;
import dh.project.backend.dto.object.LikeListItem;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class GetLikeListResponseDto {

    private final List<LikeListItem> likeList;

    @Builder
    public GetLikeListResponseDto(List<LikeListItem> likeList) {
        this.likeList = likeList;
    }

    public static GetLikeListResponseDto fromEntity(BoardEntity board, List<LikeEntity> likeEntities) {
        List<LikeListItem> likeList = likeEntities.stream()
                .map(LikeListItem::fromEntity)
                .collect(Collectors.toList());

        return GetLikeListResponseDto.builder()
                .likeList(likeList)
                .build();
    }
}
