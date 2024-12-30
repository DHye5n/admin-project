package dh.project.backend.dto.response.search;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class GetPopularListResponseDto {

    private final List<String> popularWordList;

    @Builder
    public GetPopularListResponseDto(List<String> popularWordList) {
        this.popularWordList = popularWordList;
    }

    public static GetPopularListResponseDto fromEntityList(List<String> popularWords) {
        return GetPopularListResponseDto.builder()
                .popularWordList(popularWords)
                .build();
    }
}
