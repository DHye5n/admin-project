package dh.project.backend.service;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.CommentEntity;
import dh.project.backend.domain.UserEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.comment.PatchCommentRequestDto;
import dh.project.backend.dto.request.comment.PostCommentRequestDto;
import dh.project.backend.dto.response.comment.DeleteCommentResponseDto;
import dh.project.backend.dto.response.comment.GetCommentListResponseDto;
import dh.project.backend.dto.response.comment.PatchCommentResponseDto;
import dh.project.backend.dto.response.comment.PostCommentResponseDto;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.BoardRepository;
import dh.project.backend.repository.CommentRepository;
import dh.project.backend.repository.UserRepository;
import dh.project.backend.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final AuthService authService;

    /**
     *   TODO: 댓글 작성
     * */
    @Transactional
    public ApiResponseDto<PostCommentResponseDto> postComment(
            PostCommentRequestDto requestDto, Long boardId, Long userId) {

        if (userId == null) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));


        if ((requestDto.getComment() == null || requestDto.getComment().trim().isEmpty())) {
            throw new ErrorException(ResponseStatus.NOT_EMPTY);
        }

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

        CommentEntity commentEntity = requestDto.toEntity(userEntity, boardEntity);

        CommentEntity savedComment = commentRepository.save(commentEntity);

        increaseCommentCount(boardId);

        PostCommentResponseDto responseDto = PostCommentResponseDto.fromEntity(savedComment);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 댓글 리스트
     * */
    @Transactional(readOnly = true)
    public ApiResponseDto<GetCommentListResponseDto> getCommentList(Long boardId) {

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .filter(board -> board.getDeletedDate() == null)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        List<CommentEntity> commentEntities = commentRepository.findCommentsWithUserByBoardId(boardId);

        GetCommentListResponseDto responseDto = GetCommentListResponseDto.fromEntity(boardEntity, commentEntities);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 댓글 수정
     * */
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ApiResponseDto<PatchCommentResponseDto> patchComment(
            PatchCommentRequestDto dto, Long boardId, Long commentId, Long userId) {

        if (userId == null) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        CommentEntity commentEntity = commentRepository.findByIdWithUser(boardId, commentId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_COMMENT));

        if (!commentEntity.getUser().getUserId().equals(userId)) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        commentEntity.patchComment(dto);

        commentRepository.save(commentEntity);

        PatchCommentResponseDto responseDto = PatchCommentResponseDto.fromEntity(commentEntity);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);

    }

    /**
     *   TODO: 댓글 삭제
     * */
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ApiResponseDto<DeleteCommentResponseDto> deleteComment(Long boardId, Long commentId, Long userId) {

        if (userId == null) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        CommentEntity commentEntity = commentRepository.findByIdWithUser(boardId, commentId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_COMMENT));

        if (!commentEntity.getUser().getUserId().equals(userId)) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        commentRepository.delete(commentEntity);

        DeleteCommentResponseDto responseDto = DeleteCommentResponseDto.fromEntity(commentEntity);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);

    }

    /**
     *   TODO: 댓글수
     * */
    @Transactional
    public void increaseCommentCount(Long boardId) {

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        commentRepository.increaseCommentCount(boardId);

        boardRepository.save(boardEntity);
    }
}
