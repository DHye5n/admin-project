package dh.project.backend.dto.response.search;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class GetRelationListResponseDto {

    private final List<String> relationWordList;

    @Builder
    public GetRelationListResponseDto(List<String> relationWordList) {
        this.relationWordList = relationWordList;
    }

    public static GetRelationListResponseDto fromEntityList(List<String> relationWordList) {
        return GetRelationListResponseDto.builder()
                .relationWordList(relationWordList)
                .build();
    }
}
