package dh.project.backend.service;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.response.search.GetPopularListResponseDto;
import dh.project.backend.dto.response.search.GetRelationListResponseDto;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.repository.SearchLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class SearchService {

    private final SearchLogRepository searchLogRepository;

    /**
     *   TODO: 인기 검색어 리스트
     * */
    public ApiResponseDto<GetPopularListResponseDto> getPopularList() {

        List<String> popularWords = searchLogRepository.findPopularWords();

        GetPopularListResponseDto responseDto = GetPopularListResponseDto.fromEntityList(popularWords);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 연관 검색어 리스트
     * */
    public ApiResponseDto<GetRelationListResponseDto> getRelationList(String searchWord) {

        List<String> relationWords = searchLogRepository.findRelationWords(searchWord);

        GetRelationListResponseDto responseDto = GetRelationListResponseDto.fromEntityList(relationWords);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }
}
