package dh.project.backend.service;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.ImageEntity;
import dh.project.backend.domain.UserEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.board.BoardPostRequestDto;
import dh.project.backend.dto.response.board.BoardPostResponseDto;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.BoardRepository;
import dh.project.backend.repository.ImageRepository;
import dh.project.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final ImageRepository imageRepository;

    @Transactional
    public ApiResponseDto<BoardPostResponseDto> createBoard(BoardPostRequestDto requestDto, String username) {

        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));


        BoardEntity board = requestDto.toEntity(userEntity);

        BoardEntity savedBoard = boardRepository.save(board);

        List<ImageEntity> imageEntities = requestDto.getBoardImageList().stream()
                .map(image -> ImageEntity.builder()
                        .image(image)
                        .board(board) // 연관 관계 설정
                        .build())
                        .collect(Collectors.toList());

        imageRepository.saveAll(imageEntities);


        BoardPostResponseDto responseDto = BoardPostResponseDto.fromEntity(savedBoard);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }
}
