package dh.project.backend.dto.request.auth;

import dh.project.backend.domain.UserEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Getter
@NoArgsConstructor
public class SignInRequestDto {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @Builder
    public SignInRequestDto(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public UserEntity toEntity() {
        return UserEntity.builder()
                .username(username)
                .password(password)
                .build();
    }
}
