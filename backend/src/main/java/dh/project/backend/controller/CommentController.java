package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.comment.PostCommentRequestDto;
import dh.project.backend.dto.response.comment.PostCommentResponseDto;
import dh.project.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequiredArgsConstructor
@RequestMapping("/api/v1/comments")
@RestController
public class CommentController {

    private final CommentService commentService;

    /**
     *   TODO: 댓글 작성
     * */
    @PostMapping("/{boardId}/comment")
    public ResponseEntity<ApiResponseDto<PostCommentResponseDto>> createComment(
            @Valid @RequestBody PostCommentRequestDto dto,
            @PathVariable("boardId") Long boardId
            ) {
        ApiResponseDto<PostCommentResponseDto> responseDto = commentService.createComment(dto, boardId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

}
