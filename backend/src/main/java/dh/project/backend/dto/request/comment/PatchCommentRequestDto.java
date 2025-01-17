package dh.project.backend.dto.request.comment;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PatchCommentRequestDto {


    @NotBlank
    private String comment;

    private String modifiedDate;


    @Builder
    public PatchCommentRequestDto(String comment, String modifiedDte) {
        this.comment = comment;
        this.modifiedDate = modifiedDte;
    }

}
