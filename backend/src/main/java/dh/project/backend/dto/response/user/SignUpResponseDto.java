package dh.project.backend.dto.response.user;

import dh.project.backend.domain.UserEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class SignUpResponseDto {

    private final Long userId;
    private final String email;
    private final String username;

    @Builder
    public SignUpResponseDto(Long userId, String email, String username) {
        this.userId = userId;
        this.email = email;
        this.username = username;

    }

    public static SignUpResponseDto fromEntity(UserEntity user) {
        return SignUpResponseDto.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .username(user.getUsername())
                .build();
    }
}
