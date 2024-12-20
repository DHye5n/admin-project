package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.board.PostBoardRequestDto;
import dh.project.backend.dto.response.board.GetBoardResponseDto;
import dh.project.backend.dto.response.board.GetLikeListResponseDto;
import dh.project.backend.dto.response.board.PostBoardResponseDto;
import dh.project.backend.dto.response.board.PutBoardResponseDto;
import dh.project.backend.service.BoardService;
import dh.project.backend.service.principal.PrincipalDetails;
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
            @AuthenticationPrincipal PrincipalDetails user
            ) {
        ApiResponseDto<PostBoardResponseDto> responseDto = boardService.createBoard(dto, user.getUserId());
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 특정 게시물
     * */
    @GetMapping("/{boardId}")
    public ResponseEntity<ApiResponseDto<GetBoardResponseDto>> getBoard(@PathVariable("boardId") Long boardId) {
        boardService.increaseViewCount(boardId);
        ApiResponseDto<GetBoardResponseDto> responseDto = boardService.getBoard(boardId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 좋아요
     * */
    @PutMapping("/{boardId}/like")
    public ResponseEntity<ApiResponseDto<PutBoardResponseDto>> toggleLike(
            @PathVariable("boardId") Long boardId,
            @AuthenticationPrincipal PrincipalDetails user
    ) {
        ApiResponseDto<PutBoardResponseDto> responseDto = boardService.toggleLike(boardId, user.getUserId());
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
}
