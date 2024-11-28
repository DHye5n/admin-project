package dh.project.backend.dto.response.auth;

import dh.project.backend.domain.UserEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class SignUpResponseDto {

    private final String email;
    private final String username;

    @Builder
    public SignUpResponseDto(String email, String username) {
        this.email = email;
        this.username = username;

    }

    public static SignUpResponseDto fromEntity(UserEntity user) {
        return SignUpResponseDto.builder()
                .email(user.getEmail())
                .username(user.getUsername())
                .build();
    }
}
