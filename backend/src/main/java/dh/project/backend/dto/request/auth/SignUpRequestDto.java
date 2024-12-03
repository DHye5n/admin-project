package dh.project.backend.dto.request.auth;

import dh.project.backend.domain.UserEntity;
import dh.project.backend.enums.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;

@Getter
@NoArgsConstructor
public class SignUpRequestDto {

    @NotBlank
    @Email(message = "이메일 형식에 맞춰주세요.")
    private String email;

    @NotBlank
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하이어야 합니다.")
    @Pattern(regexp = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,20}$", message = "비밀번호는 숫자, 소문자, 대문자, 특수문자를 각각 하나 이상 포함해야 합니다.")
    private String password;

    @NotBlank
    private String passwordCheck;

    @NotBlank
    @Size(min = 3, max = 10)
    private String username;

    @NotBlank
    @Pattern(regexp = "^[0-9]{11,13}$", message = "핸드폰 번호는 11자리입니다.")
    private String phone;

    @NotBlank
    private String zonecode;

    @NotBlank
    private String address;

    @NotBlank
    private String addressDetail;

    @NotNull
    @AssertTrue
    private Boolean agreedPersonal;

    private Role role = Role.USER;

    @NotBlank
    private String verificationCode;

    @Builder
    public SignUpRequestDto(String email, String password, String passwordCheck, String username, String phone,
                            String zonecode, String address, String addressDetail,
                            Boolean agreedPersonal, Role role, String verificationCode) {
        this.email = email;
        this.password = password;
        this.passwordCheck = passwordCheck;
        this.username = username;
        this.phone = phone;
        this.zonecode = zonecode;
        this.address = address;
        this.addressDetail = addressDetail;
        this.agreedPersonal = agreedPersonal;
        this.role = role != null ? role : Role.USER;
        this.verificationCode = verificationCode;
    }

    public UserEntity toEntity(String encodedPassword) {
        return UserEntity.builder()
                .email(email)
                .password(encodedPassword)
                .username(username)
                .phone(phone)
                .zonecode(zonecode)
                .address(address)
                .addressDetail(addressDetail)
                .agreedPersonal(agreedPersonal)
                .role(role != null ? role : Role.USER) 
                .build();
    }

    public boolean isPasswordMatching() {
        return password.equals(passwordCheck);
    }
}
