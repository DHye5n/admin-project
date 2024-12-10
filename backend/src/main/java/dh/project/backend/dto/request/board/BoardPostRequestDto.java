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
public class BoardPostRequestDto {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private List<String> boardImageList;

    @Builder
    public BoardPostRequestDto(String title, String content, List<String> boardImageList) {
        this.title = title;
        this.content = content;
        this.boardImageList = boardImageList;
    }

    public BoardEntity toEntity(UserEntity user) {
        return BoardEntity.builder()
                .title(title)
                .content(content)
                .user(user)
                .build();
    }
}
