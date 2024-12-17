package dh.project.backend.service;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.CommentEntity;
import dh.project.backend.domain.UserEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.comment.PostCommentRequestDto;
import dh.project.backend.dto.response.comment.GetCommentListResponseDto;
import dh.project.backend.dto.response.comment.PostCommentResponseDto;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.BoardRepository;
import dh.project.backend.repository.CommentRepository;
import dh.project.backend.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final AuthService authService;

    private final BoardRepository boardRepository;
    private final CommentRepository commentRepository;

    /**
     *   TODO: 댓글 작성
     * */
    @Transactional
    public ApiResponseDto<PostCommentResponseDto> createComment(PostCommentRequestDto requestDto, Long boardId, Long userId) {

        UserEntity userEntity = authService.checkUserAuthorization(userId);

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        if ((requestDto.getComment() == null || requestDto.getComment().trim().isEmpty())) {
            throw new ErrorException(ResponseStatus.NOT_EMPTY);
        }

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
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        List<CommentEntity> commentEntities = commentRepository.findCommentsWithUserByBoardId(boardId);

        GetCommentListResponseDto responseDto = GetCommentListResponseDto.fromEntity(boardEntity, commentEntities);

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
