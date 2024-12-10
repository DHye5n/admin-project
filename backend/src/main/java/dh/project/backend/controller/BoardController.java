package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.board.BoardPostRequestDto;
import dh.project.backend.dto.response.board.BoardPostResponseDto;
import dh.project.backend.service.BoardService;
import dh.project.backend.service.principal.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
