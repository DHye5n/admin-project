package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.response.search.GetPopularListResponseDto;
import dh.project.backend.dto.response.search.GetRelationListResponseDto;
import dh.project.backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/api/v1/searches")
@RestController
public class SearchController {

    private final SearchService searchService;

    /**
     *   TODO: 인기 검색어 리스트
     * */
    @GetMapping("/populars")
    public ResponseEntity<ApiResponseDto<GetPopularListResponseDto>> getPopularList() {
        ApiResponseDto<GetPopularListResponseDto> responseDto = searchService.getPopularList();
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 인기 검색어 리스트
     * */
    @GetMapping("/{searchWord}/relations")
    public ResponseEntity<ApiResponseDto<GetRelationListResponseDto>> getRelationList(@PathVariable("searchWord") String searchWord) {
        ApiResponseDto<GetRelationListResponseDto> responseDto = searchService.getRelationList(searchWord);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }
}
