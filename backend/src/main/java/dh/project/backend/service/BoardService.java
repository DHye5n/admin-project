package dh.project.backend.service;

import dh.project.backend.domain.*;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.object.BoardListItem;
import dh.project.backend.dto.request.board.PatchBoardRequestDto;
import dh.project.backend.dto.request.board.PostBoardRequestDto;
import dh.project.backend.dto.response.board.*;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.*;
import dh.project.backend.service.auth.AuthService;
import dh.project.backend.service.principal.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final ImageRepository imageRepository;
    private final LikeRepository likeRepository;
    private final AuthService authService;
    private final BoardListViewRepository boardListViewRepository;
    private final SearchLogRepository searchLogRepository;

    /**
     *   TODO: 게시물 작성
     * */
    @Transactional
    public ApiResponseDto<PostBoardResponseDto> createBoard(PostBoardRequestDto dto, PrincipalDetails user) {

        if (user == null) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        if ((dto.getTitle() == null || dto.getTitle().trim().isEmpty()) ||
            (dto.getContent() == null || dto.getContent().trim().isEmpty()) ||
            (dto.getBoardImageList() == null || dto.getBoardImageList().isEmpty())) {
            throw new ErrorException(ResponseStatus.NOT_EMPTY);
        }

        BoardEntity boardEntity = dto.toEntity(user.getUserId());

        BoardEntity savedBoard = boardRepository.save(boardEntity);

        List<ImageEntity> imageEntities = saveImage(dto, savedBoard);

        imageRepository.saveAll(imageEntities);

        BoardEntity result = boardRepository.findBoardWithUserAndImages(savedBoard.getBoardId())
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));


        PostBoardResponseDto responseDto = PostBoardResponseDto.fromEntity(result);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 특정 게시물
     * */
    @Transactional(readOnly = true)
    public ApiResponseDto<GetBoardResponseDto> getBoard(Long boardId) {

        BoardEntity boardEntity = boardRepository.findByIdWithImages(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

        GetBoardResponseDto responseDto = GetBoardResponseDto.fromEntity(boardEntity, boardEntity.getImages());

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 특정 유저 게시물
     * */
    @Transactional(readOnly = true)
    public ApiResponseDto<GetUserBoardListResponseDto> getUserBoardList(Long userId) {

        List<BoardListViewEntity> userBoardList = boardListViewRepository.findUserBoardList(userId);

        if (userBoardList.isEmpty()) {
            throw new ErrorException(ResponseStatus.NOT_FOUND_BOARD);
        }

        List<BoardListItem> boardListItems = BoardListItem.fromEntityList(userBoardList);

        GetUserBoardListResponseDto responseDto = new GetUserBoardListResponseDto(boardListItems);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 게시물 수정
     * */
    @Transactional
    public ApiResponseDto<PatchBoardResponseDto> patchBoard(
            PatchBoardRequestDto dto, Long boardId, PrincipalDetails user) {

            if (user == null) {
                throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
            }

            BoardEntity boardEntity = boardRepository.findByIdWithImages(boardId)
                    .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

            authService.checkUserAuthorization(boardEntity.getUser().getUserId(), user);

            boardEntity.patchBoard(dto);

            List<ImageEntity> newImageEntities = updateImage(dto, boardEntity);
            if (newImageEntities.isEmpty() && boardEntity.getImages().isEmpty()) {
                throw new ErrorException(ResponseStatus.NOT_EMPTY);
            }

            List<ImageEntity> currentImages = boardEntity.getImages();
            List<ImageEntity> imagesToRemove = new ArrayList<>();
            List<ImageEntity> imagesToSave = new ArrayList<>(newImageEntities);

            for (ImageEntity currentImage : currentImages) {
                if (!newImageEntities.stream().anyMatch(newImage -> newImage.getImageUrl().equals(currentImage.getImageUrl()))) {
                    imagesToRemove.add(currentImage);
                }
            }

            if (!imagesToRemove.isEmpty()) {
                imageRepository.deleteAll(imagesToRemove);
                boardEntity.getImages().removeAll(imagesToRemove);
            }

            if (!imagesToSave.isEmpty()) {
                imageRepository.saveAll(imagesToSave);
            }

            boardEntity = boardRepository.findById(boardId)
                    .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));

            boardRepository.save(boardEntity);

            PatchBoardResponseDto responseDto = PatchBoardResponseDto.fromEntity(boardEntity);

            return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 게시물 삭제
     * */
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ApiResponseDto<DeleteBoardResponseDto> deleteBoard(Long boardId, PrincipalDetails user) {

        if (user == null) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_BOARD));


        authService.checkUserAuthorization(boardEntity.getUser().getUserId(), user);

        boardRepository.delete(boardEntity);

        DeleteBoardResponseDto responseDto = DeleteBoardResponseDto.fromEntity(boardEntity);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);

    }

    /**
     *   TODO: 이미지 저장
     * */
    @Transactional
    public List<ImageEntity> saveImage(PostBoardRequestDto dto, BoardEntity board) {
        return dto.getBoardImageList().stream()
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
    public ApiResponseDto<PutLikeResponseDto> toggleLike(Long boardId, PrincipalDetails user) {

        if (user == null) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        Optional<BoardEntity> boardOptional = boardRepository.findById(boardId);
        if (!boardOptional.isPresent()) {
            throw new ErrorException(ResponseStatus.NOT_FOUND_BOARD);
        }
        BoardEntity boardEntity = boardOptional.get();

        Optional<LikeEntity> likeEntity = likeRepository.findByBoard_BoardIdAndUser_UserId(boardId, user.getUserId());
        boolean isLiking = likeEntity.isPresent();

        if (likeEntity.isPresent()) {
            likeRepository.delete(likeEntity.get());
            int currentLikeCount = boardEntity.getLikeCount();
            if (currentLikeCount > 0) {
                likeRepository.decreaseLikeCount(boardId);
            }
            isLiking = false;
        } else {
            LikeEntity newLike = LikeEntity.builder()
                    .user(user.getUser())
                    .board(boardEntity)
                    .build();
            likeRepository.save(newLike);
            likeRepository.increaseLikeCount(boardId);
            isLiking = true;
        }

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
     *   TODO: 최신 게시물 리스트
     * */
    @Transactional(readOnly = true)
    public ApiResponseDto<GetLatestBoardListResponseDto> getLatestBoardList() {

        List<BoardListViewEntity> latestBoards = boardListViewRepository.findLatestBoards();

        List<BoardListItem> boardListItems = BoardListItem.fromEntityList(latestBoards);

        GetLatestBoardListResponseDto responseDto = new GetLatestBoardListResponseDto(boardListItems);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: Top3 게시물 리스트
     * */
    @Transactional(readOnly = true)
    public ApiResponseDto<GetTop3BoardListResponseDto> getTop3BoardList() {

        List<BoardListViewEntity> top3Boards = boardListViewRepository.findTop3Boards();

        List<BoardListItem> boardListItems = BoardListItem.fromEntityList(top3Boards);

        GetTop3BoardListResponseDto responseDto = new GetTop3BoardListResponseDto(boardListItems);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 검색 게시물 리스트
     * */
    @Transactional(readOnly = true)
    public ApiResponseDto<GetSearchBoardListResponseDto> getSearchBoardList(String searchWord, String preSearchWord) {

        List<BoardListViewEntity> searchBoards =
                boardListViewRepository.findSearchBoards(searchWord, searchWord);

        List<BoardListItem> boardListItems = BoardListItem.fromEntityList(searchBoards);

        GetSearchBoardListResponseDto responseDto = new GetSearchBoardListResponseDto(boardListItems);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    public boolean isRelated(String searchWord, String preSearchWord) {

        if (preSearchWord == null || preSearchWord.isEmpty()) {
            return false;
        }

        return searchWord.contains(preSearchWord);
    }

    @Transactional
    public void saveSearchLog(String searchWord, String preSearchWord) {

        boolean relation = isRelated(searchWord, preSearchWord);

        if (preSearchWord == null) {
            preSearchWord = "";
        }

        SearchLogEntity searchLogEntity = SearchLogEntity.builder()
                .searchWord(searchWord)
                .relationWord(preSearchWord)
                .relation(relation)
                .build();

        searchLogRepository.save(searchLogEntity);
    }

}
