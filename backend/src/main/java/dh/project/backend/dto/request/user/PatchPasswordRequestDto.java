package dh.project.backend.dto.request.user;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PatchPasswordRequestDto {

    @NotBlank
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하이어야 합니다.")
    @Pattern(regexp = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,20}$", message = "비밀번호는 숫자, 소문자, 대문자, 특수문자를 각각 하나 이상 포함해야 합니다.")
    private String newPassword;

    @NotBlank
    private String newPasswordCheck;


    @Builder
    public PatchPasswordRequestDto(String newPassword, String newPasswordCheck) {
        this.newPassword = newPassword;
        this.newPasswordCheck = newPasswordCheck;
    }

    public boolean isNewPasswordMatching() {
        return newPassword.equals(newPasswordCheck);
    }
}
