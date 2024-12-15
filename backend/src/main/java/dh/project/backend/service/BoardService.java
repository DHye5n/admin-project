package dh.project.backend.service;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.ImageEntity;
import dh.project.backend.domain.LikeEntity;
import dh.project.backend.domain.UserEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.board.BoardPostRequestDto;
import dh.project.backend.dto.response.board.BoardGetResponseDto;
import dh.project.backend.dto.response.board.BoardPostResponseDto;
import dh.project.backend.dto.response.board.BoardPutResponseDto;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.BoardRepository;
import dh.project.backend.repository.ImageRepository;
import dh.project.backend.repository.LikeRepository;
import dh.project.backend.repository.UserRepository;
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

    @Transactional
    public ApiResponseDto<BoardPostResponseDto> createBoard(BoardPostRequestDto requestDto, String username) {

        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

        BoardEntity board = requestDto.toEntity(userEntity);

        BoardEntity savedBoard = boardRepository.save(board);

        List<ImageEntity> imageEntities = saveImage(requestDto, savedBoard);

        imageRepository.saveAll(imageEntities);

        BoardPostResponseDto responseDto = BoardPostResponseDto.fromEntity(savedBoard);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    private List<ImageEntity> saveImage(BoardPostRequestDto requestDto, BoardEntity board) {
        return requestDto.getBoardImageList().stream()
                .map(imageUrl -> ImageEntity.builder()
                        .imageUrl(imageUrl)
                        .board(board)
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ApiResponseDto<BoardGetResponseDto> getBoard(Long boardId) {

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        List<ImageEntity> imageEntities = imageRepository.findByBoard_BoardId(boardId);

        BoardGetResponseDto responseDto = BoardGetResponseDto.fromEntity(boardEntity, imageEntities);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    @Transactional
    public void increaseViewCount(Long boardId) {

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        boardRepository.increaseViewCount(boardId);

        boardRepository.save(boardEntity);
    }

    @Transactional
    public ApiResponseDto<BoardPutResponseDto> toggleLike(Long boardId, String username) {

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

        Optional<LikeEntity> likeEntity = likeRepository.findByBoard_BoardIdAndUser_Username(boardId, username);

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

        BoardPutResponseDto responseDto = BoardPutResponseDto.fromEntity(boardEntity, isLiking);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }
}
