package dh.project.backend.dto.request.board;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PatchBoardRequestDto {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private List<String> boardImageList;

    private String modifiedDate;


    @Builder
    public PatchBoardRequestDto(String title, String content, List<String> boardImageList, String modifiedDte) {
        this.title = title;
        this.content = content;
        this.boardImageList = boardImageList;
        this.modifiedDate = modifiedDte;
    }

}