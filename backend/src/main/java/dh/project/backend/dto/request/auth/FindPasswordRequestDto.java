package dh.project.backend.dto.request.auth;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FindPasswordRequestDto {

    @NotBlank
    private String email;

    @NotBlank
    private String username;

    @NotBlank
    private String verificationCode;

    @Builder
    public FindPasswordRequestDto(String email, String username, String verificationCode) {
        this.email = email;
        this.username = username;
        this.verificationCode = verificationCode;
    }
}
