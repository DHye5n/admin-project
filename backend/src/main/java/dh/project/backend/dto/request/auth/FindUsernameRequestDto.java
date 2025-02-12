package dh.project.backend.dto.request.auth;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FindUsernameRequestDto {

    @NotBlank
    private String email;

    @NotBlank
    private String verificationCode;

    @Builder
    public FindUsernameRequestDto(String email, String verificationCode) {
        this.email = email;
        this.verificationCode = verificationCode;
    }
}
