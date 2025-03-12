package dh.project.backend.dto.response.board;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.ImageEntity;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PatchBoardResponseDto {

    private final Long boardId;
    private final String title;
    private final String content;
    private final List<String> boardImageList;
    private final List<String> existingBoardImages;


    @Builder
    public PatchBoardResponseDto(Long boardId, String title, String content,
                                 List<String> boardImageList, List<String> existingBoardImages) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.boardImageList = boardImageList;
        this.existingBoardImages = existingBoardImages;
    }

    public static PatchBoardResponseDto fromEntity(BoardEntity board) {
        return PatchBoardResponseDto.builder()
                .boardId(board.getBoardId())
                .title(board.getTitle())
                .content(board.getContent())
                .boardImageList(board.getImages().stream()
                        .map(ImageEntity::getImageUrl)
                        .collect(Collectors.toList()))
                .existingBoardImages(board.getImages().stream()
                        .filter(image -> image.getImageUrl() != null) // 기존 이미지 URL 필터링 (필요시 조정)
                        .map(ImageEntity::getImageUrl)
                        .collect(Collectors.toList()))
                .build();
    }
}
