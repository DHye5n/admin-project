package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.comment.PatchCommentRequestDto;
import dh.project.backend.dto.request.comment.PostCommentRequestDto;
import dh.project.backend.dto.response.comment.DeleteCommentResponseDto;
import dh.project.backend.dto.response.comment.GetCommentListResponseDto;
import dh.project.backend.dto.response.comment.PatchCommentResponseDto;
import dh.project.backend.dto.response.comment.PostCommentResponseDto;
import dh.project.backend.service.CommentService;
import dh.project.backend.service.principal.user.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            @PathVariable("boardId") Long boardId,
            @AuthenticationPrincipal PrincipalDetails user
            ) {
        ApiResponseDto<PostCommentResponseDto> responseDto = commentService.postComment(dto, boardId, user);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 댓글 수정
     * */
    @PatchMapping("/{boardId}/{commentId}")
    public ResponseEntity<ApiResponseDto<PatchCommentResponseDto>> patchBoard(
            @Valid @RequestBody PatchCommentRequestDto dto,
            @PathVariable("boardId") Long boardId,
            @PathVariable("commentId") Long commentId,
            @AuthenticationPrincipal PrincipalDetails user) {
        ApiResponseDto<PatchCommentResponseDto> responseDto = commentService.patchComment(dto, boardId, commentId, user);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 댓글 삭제
     * */
    @DeleteMapping("/{boardId}/{commentId}")
    public ResponseEntity<ApiResponseDto<DeleteCommentResponseDto>> deleteComment(
            @PathVariable("boardId") Long boardId,
            @PathVariable("commentId") Long commentId,
            @AuthenticationPrincipal PrincipalDetails user
    ) {
        ApiResponseDto<DeleteCommentResponseDto> responseDto = commentService.deleteComment(boardId, commentId, user);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 댓글 리스트
     * */
    @GetMapping("/{boardId}/comment-list")
    public ResponseEntity<ApiResponseDto<GetCommentListResponseDto>> getCommentList(@PathVariable("boardId") Long boardId) {
        ApiResponseDto<GetCommentListResponseDto> responseDto = commentService.getCommentList(boardId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }
}
