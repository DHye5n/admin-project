package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.board.BoardPostRequestDto;
import dh.project.backend.dto.response.board.BoardGetResponseDto;
import dh.project.backend.dto.response.board.BoardPostResponseDto;
import dh.project.backend.dto.response.board.BoardPutResponseDto;
import dh.project.backend.service.BoardService;
import dh.project.backend.service.principal.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequiredArgsConstructor
@RequestMapping("/api/v1/board")
@RestController
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    public ResponseEntity<ApiResponseDto<BoardPostResponseDto>> createBoard(
            @Valid @RequestBody BoardPostRequestDto dto,
            @AuthenticationPrincipal PrincipalDetails user
            ) {
        ApiResponseDto<BoardPostResponseDto> responseDto = boardService.createBoard(dto, user.getUsername());
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<ApiResponseDto<BoardGetResponseDto>> getBoard(@PathVariable("boardId") Long boardId) {
        boardService.increaseViewCount(boardId);
        ApiResponseDto<BoardGetResponseDto> responseDto = boardService.getBoard(boardId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    @PutMapping("/{boardId}/likes")
    public ResponseEntity<ApiResponseDto<BoardPutResponseDto>> toggleLike(
            @PathVariable("boardId") Long boardId,
            @AuthenticationPrincipal PrincipalDetails user
    ) {
        ApiResponseDto<BoardPutResponseDto> responseDto = boardService.toggleLike(boardId, user.getUsername());
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }
}
