package dh.project.backend.service;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.ImageEntity;
import dh.project.backend.domain.LikeEntity;
import dh.project.backend.domain.UserEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.board.PostBoardRequestDto;
import dh.project.backend.dto.response.board.*;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.BoardRepository;
import dh.project.backend.repository.ImageRepository;
import dh.project.backend.repository.LikeRepository;
import dh.project.backend.repository.UserRepository;
import dh.project.backend.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final ImageRepository imageRepository;
    private final LikeRepository likeRepository;
    private final AuthService authService;

    /**
     *   TODO: 게시물 작성
     * */
    @Transactional
    public ApiResponseDto<PostBoardResponseDto> createBoard(PostBoardRequestDto requestDto, Long userId) {

        if ((requestDto.getTitle() == null || requestDto.getTitle().trim().isEmpty()) ||
                (requestDto.getContent() == null || requestDto.getContent().trim().isEmpty())) {
            throw new ErrorException(ResponseStatus.NOT_EMPTY);
        }

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

        BoardEntity boardEntity = requestDto.toEntity(userEntity);

        BoardEntity savedBoard = boardRepository.save(boardEntity);

        List<ImageEntity> imageEntities = saveImage(requestDto, savedBoard);

        imageRepository.saveAll(imageEntities);

        PostBoardResponseDto responseDto = PostBoardResponseDto.fromEntity(savedBoard);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 이미지 저장
     * */
    private List<ImageEntity> saveImage(PostBoardRequestDto requestDto, BoardEntity board) {
        return requestDto.getBoardImageList().stream()
                .map(imageUrl -> ImageEntity.builder()
                        .imageUrl(imageUrl)
                        .board(board)
                        .build())
                .collect(Collectors.toList());
    }

    /**
     *   TODO: 특정 게시물
     * */
    @Transactional(readOnly = true)
    public ApiResponseDto<GetBoardResponseDto> getBoard(Long boardId) {

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        List<ImageEntity> imageEntities = imageRepository.findByBoard_BoardId(boardId);

        GetBoardResponseDto responseDto = GetBoardResponseDto.fromEntity(boardEntity, imageEntities);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }
    /**
     *   TODO: 조회수
     * */
    @Transactional
    public ApiResponseDto<ViewCountResponseDto> increaseViewCount(Long boardId) {

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        boardRepository.increaseViewCount(boardId);

        ViewCountResponseDto responseDto = ViewCountResponseDto.fromEntity(boardEntity);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 좋아요
     * */
    @Transactional
    public ApiResponseDto<PutLikeResponseDto> toggleLike(Long boardId, Long userId) {

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

        Optional<LikeEntity> likeEntity = likeRepository.findByBoard_BoardIdAndUser_UserId(boardId, userId);

        boolean isLiking;

        if (likeEntity.isPresent()) {
            likeRepository.delete(likeEntity.get());
            int currentLikeCount = boardEntity.getLikeCount();
            if (currentLikeCount > 0) {
                likeRepository.decreaseLikeCount(boardId);
            }
            isLiking = false;
        } else {
            LikeEntity newLike = LikeEntity.builder()
                    .user(userEntity)
                    .board(boardEntity)
                    .build();
            likeRepository.save(newLike);
            likeRepository.increaseLikeCount(boardId);
            isLiking = true;
        }

        boardRepository.save(boardEntity);

        PutLikeResponseDto responseDto = PutLikeResponseDto.fromEntity(boardEntity, isLiking);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 좋아요 리스트
     * */
    @Transactional(readOnly = true)
    public ApiResponseDto<GetLikeListResponseDto> getLikeList(Long boardId) {

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        List<LikeEntity> likeEntities = likeRepository.findLikesWithUserByBoardId(boardId);

        GetLikeListResponseDto responseDto = GetLikeListResponseDto.fromEntity(boardEntity, likeEntities);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 게시물 삭제
     * */
    @Transactional
    public ApiResponseDto<DeleteBoardResponseDto> deleteBoard(Long boardId, Long userId) {

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        authService.checkUserAuthorization(boardEntity.getUser().getUserId(), userId);

        boardRepository.delete(boardEntity);

        DeleteBoardResponseDto responseDto = DeleteBoardResponseDto.fromEntity(boardEntity);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);

    }
}
