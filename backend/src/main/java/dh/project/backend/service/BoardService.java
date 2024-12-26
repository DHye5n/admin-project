package dh.project.backend.service;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.ImageEntity;
import dh.project.backend.domain.LikeEntity;
import dh.project.backend.domain.UserEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.board.PatchBoardRequestDto;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
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
     *   TODO: 게시물 수정
     * */
    @Transactional
    public ApiResponseDto<PatchBoardResponseDto> patchBoard(PatchBoardRequestDto dto, Long boardId, Long userId) {

        try {
            // 1. 게시물 조회
            BoardEntity boardEntity = boardRepository.findByIdWithImages(boardId)
                    .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

            // 2. 게시물 작성자 확인
            authService.checkUserAuthorization(boardEntity.getUser().getUserId(), userId);

            // 3. 게시물 내용 수정
            boardEntity.patchBoard(dto);

            // 4. 이미지 엔티티 생성
            List<ImageEntity> newImageEntities = updateImage(dto, boardEntity);

            // 5. 기존 이미지 삭제 및 새 이미지 저장
            List<ImageEntity> currentImages = boardEntity.getImages();
            List<ImageEntity> imagesToRemove = new ArrayList<>();
            List<ImageEntity> imagesToSave = new ArrayList<>(newImageEntities);

            for (ImageEntity currentImage : currentImages) {
                if (!newImageEntities.stream().anyMatch(newImage -> newImage.getImageUrl().equals(currentImage.getImageUrl()))) {
                    imagesToRemove.add(currentImage);
                }
            }

            // 삭제된 이미지는 DB에서 삭제
            if (!imagesToRemove.isEmpty()) {
                imageRepository.deleteAll(imagesToRemove);
                boardEntity.getImages().removeAll(imagesToRemove);
            }

            // 새 이미지는 DB에 저장
            if (!imagesToSave.isEmpty()) {
                imageRepository.saveAll(imagesToSave);
            }

            boardEntity = boardRepository.findById(boardId)
                    .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

            // 6. 수정된 게시물 저장
            boardRepository.save(boardEntity);

            // 7. 응답 DTO 생성
            PatchBoardResponseDto responseDto = PatchBoardResponseDto.fromEntity(boardEntity);

            // 8. 응답 반환
            return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ErrorException(ResponseStatus.DATABASE_ERROR);
        }
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

    /**
     *   TODO: 이미지 저장
     * */
    @Transactional
    public List<ImageEntity> saveImage(PostBoardRequestDto postDto, BoardEntity board) {
        return postDto.getBoardImageList().stream()
                .map(imageUrl -> ImageEntity.builder()
                        .imageUrl(imageUrl)
                        .board(board)
                        .build())
                .collect(Collectors.toList());
    }

    /**
     *   TODO: 이미지 수정
     * */
    @Transactional
    public List<ImageEntity> updateImage(PatchBoardRequestDto dto, BoardEntity board) {
        List<ImageEntity> newImageEntities = dto.getBoardImageList().stream()
                .map(imageUrl -> ImageEntity.builder()
                        .imageUrl(imageUrl)
                        .board(board)
                        .build())
                .collect(Collectors.toList());

        return newImageEntities;
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


}
