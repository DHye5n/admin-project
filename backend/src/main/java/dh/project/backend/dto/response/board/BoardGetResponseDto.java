package dh.project.backend.dto.response.board;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.ImageEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class BoardGetResponseDto {

    private final Long boardId;

    private final String title;

    private final String content;

    private final List<String> boardImageList;

    private final LocalDateTime createdDate;

    private final LocalDateTime modifiedDate;

    private final String email;

    private final String username;

    private final String profileImage;

    @Builder
    public BoardGetResponseDto(Long boardId, String title, String content, List<String> boardImageList,
                               LocalDateTime createdDate, LocalDateTime modifiedDate,
                               String email, String username, String profileImage) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.boardImageList = boardImageList;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.email = email;
        this.username = username;
        this.profileImage = profileImage;
    }

    public static BoardGetResponseDto fromEntity(BoardEntity board , List<ImageEntity> images) {
        List<String> boardImageList = images.stream()
                .map(ImageEntity::getImageUrl)
                .collect(Collectors.toList());

        return BoardGetResponseDto.builder()
                .boardId(board.getBoardId())
                .title(board.getTitle())
                .content(board.getContent())
                .boardImageList(boardImageList)
                .createdDate(board.getCreatedDate())
                .modifiedDate(board.getModifiedDate())
                .email(board.getUser() != null ? board.getUser().getEmail() : null)
                .username(board.getUser() != null ? board.getUser().getUsername() : null)
                .profileImage(board.getUser() != null ? board.getUser().getProfileImage() : null)
                .build();
    }
}
