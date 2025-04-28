package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.board.PatchBoardRequestDto;
import dh.project.backend.dto.request.board.PostBoardRequestDto;
import dh.project.backend.dto.response.board.*;
import dh.project.backend.service.BoardService;
import dh.project.backend.service.principal.user.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequiredArgsConstructor
@RequestMapping("/api/v1/boards")
@RestController
public class BoardController {

    private final BoardService boardService;

    /**
     *   TODO: 게시물 작성
     * */
    @PostMapping
    public ResponseEntity<ApiResponseDto<PostBoardResponseDto>> createBoard(
            @Valid @RequestBody PostBoardRequestDto dto,
            @AuthenticationPrincipal PrincipalDetails user) {
        ApiResponseDto<PostBoardResponseDto> responseDto = boardService.postBoard(dto, user.getUserId());
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 특정 게시물
     * */
    @GetMapping("/{boardId}")
    public ResponseEntity<ApiResponseDto<GetBoardResponseDto>> getBoard(@PathVariable("boardId") Long boardId) {
        ApiResponseDto<GetBoardResponseDto> responseDto = boardService.getBoard(boardId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 모든 게시물 리스트
     * */
    @GetMapping("/list")
    public ResponseEntity<ApiResponseDto<GetAllBoardListResponseDto>> getAllBoardList() {
        ApiResponseDto<GetAllBoardListResponseDto> responseDto = boardService.getAllBoardList();
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 특정 유저 게시물
     * */
    @GetMapping("/user-board-list/{userId}")
    public ResponseEntity<ApiResponseDto<GetUserBoardListResponseDto>> getUserBoardList(@PathVariable("userId") Long userId) {
        ApiResponseDto<GetUserBoardListResponseDto> responseDto = boardService.getUserBoardList(userId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 게시물 수정
     * */
    @PatchMapping("/{boardId}")
    public ResponseEntity<ApiResponseDto<PatchBoardResponseDto>> patchBoard(
            @Valid @RequestBody PatchBoardRequestDto dto,
            @PathVariable("boardId") Long boardId,
            @AuthenticationPrincipal PrincipalDetails user) {
        ApiResponseDto<PatchBoardResponseDto> responseDto = boardService.patchBoard(dto, boardId, user.getUserId());
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 게시물 삭제
     * */
    @DeleteMapping("/{boardId}")
    public ResponseEntity<ApiResponseDto<DeleteBoardResponseDto>> deleteBoard(
            @PathVariable("boardId") Long boardId,
            @AuthenticationPrincipal PrincipalDetails user) {
        ApiResponseDto<DeleteBoardResponseDto> responseDto = boardService.deleteBoard(boardId, user.getUserId());
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 조회수
     * */
    @GetMapping("/{boardId}/view-counts")
    public ResponseEntity<ApiResponseDto<ViewCountResponseDto>> viewCounts(@PathVariable("boardId") Long boardId) {
        ApiResponseDto<ViewCountResponseDto> responseDto = boardService.increaseViewCount(boardId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 좋아요
     * */
    @PutMapping("/{boardId}/like")
    public ResponseEntity<ApiResponseDto<PutLikeResponseDto>> toggleLike(
            @PathVariable("boardId") Long boardId,
            @AuthenticationPrincipal PrincipalDetails user
    ) {
        ApiResponseDto<PutLikeResponseDto> responseDto = boardService.toggleLike(boardId, user.getUserId());
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 좋아요 리스트
     * */
    @GetMapping("/{boardId}/likes")
    public ResponseEntity<ApiResponseDto<GetLikeListResponseDto>> getLikeList(@PathVariable("boardId") Long boardId) {
        ApiResponseDto<GetLikeListResponseDto> responseDto = boardService.getLikeList(boardId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 최신 게시물 리스트
     * */
    @GetMapping("/latest-list")
    public ResponseEntity<ApiResponseDto<GetLatestBoardListResponseDto>> getLatestBoardList() {
        ApiResponseDto<GetLatestBoardListResponseDto> responseDto = boardService.getLatestBoardList();
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: Top3 게시물 리스트
     * */
    @GetMapping("/top3-list")
    public ResponseEntity<ApiResponseDto<GetTop3BoardListResponseDto>> getTop3BoardList() {
        ApiResponseDto<GetTop3BoardListResponseDto> responseDto = boardService.getTop3BoardList();
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 검색 게시물 리스트
     * */
    @GetMapping(value = {"/searches/{searchWord}", "/searches/{searchWord}/{preSearchWord}"})
    public ResponseEntity<ApiResponseDto<GetSearchBoardListResponseDto>> getSearchBoardList(
            @PathVariable("searchWord") String searchWord,
            @PathVariable(value = "preSearchWord", required = false) String preSearchWord
    ) {
        ApiResponseDto<GetSearchBoardListResponseDto> responseDto = boardService.getSearchBoardList(searchWord, preSearchWord);
        boardService.saveSearchLog(searchWord, preSearchWord);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }
}
