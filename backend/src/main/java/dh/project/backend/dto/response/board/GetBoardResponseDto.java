package dh.project.backend.dto.response.board;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.ImageEntity;
import dh.project.backend.dto.response.user.SignInUserResponseDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class GetBoardResponseDto {

    private final Long boardId;

    private final String title;

    private final String content;

    private final List<String> boardImageList;

    private final String createdDate;

    private final String modifiedDate;

    private final String email;

    private final String username;

    private final String profileImage;

    @Builder
    public GetBoardResponseDto(Long boardId, String title, String content, SignInUserResponseDto writer,
                               List<String> boardImageList, String createdDate, String modifiedDate,
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

    public static GetBoardResponseDto fromEntity(BoardEntity board , List<ImageEntity> images) {

        List<String> boardImageList = images.stream()
                .map(ImageEntity::getImageUrl)
                .collect(Collectors.toList());

        return GetBoardResponseDto.builder()
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
