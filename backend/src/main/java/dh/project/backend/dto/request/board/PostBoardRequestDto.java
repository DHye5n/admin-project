package dh.project.backend.dto.request.board;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.UserEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostBoardRequestDto {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private List<String> boardImageList;

    @Builder
    public PostBoardRequestDto(String title, String content, List<String> boardImageList) {
        this.title = title;
        this.content = content;
        this.boardImageList = boardImageList;
    }

    public BoardEntity toEntity(Long userId) {
        return BoardEntity.builder()
                .title(title)
                .content(content)
                .user(
                        UserEntity.builder()
                                .userId(userId)
                                .build()
                )
                .build();
    }
}
