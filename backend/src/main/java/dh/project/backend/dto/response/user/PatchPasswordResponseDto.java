package dh.project.backend.dto.response.user;

import dh.project.backend.domain.UserEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class PatchPasswordResponseDto {

    private final Long userId;
    private final String email;
    private final String username;

    @Builder
    public PatchPasswordResponseDto(Long userId, String email, String username) {
        this.userId = userId;
        this.email = email;
        this.username = username;
    }

    public static PatchPasswordResponseDto fromEntity(UserEntity userEntity) {
        return PatchPasswordResponseDto.builder()
                .userId(userEntity.getUserId())
                .email(userEntity.getEmail())
                .username(userEntity.getUsername())
                .build();
    }
}
