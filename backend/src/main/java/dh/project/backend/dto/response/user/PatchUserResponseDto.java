package dh.project.backend.dto.response.user;

import dh.project.backend.domain.UserEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class PatchUserResponseDto {

    private final Long userId;
    private final String username;
    private final String profileImage;

    @Builder
    public PatchUserResponseDto(Long userId, String username, String profileImage) {
        this.userId = userId;
        this.username = username;
        this.profileImage = profileImage;
    }

    public static PatchUserResponseDto fromEntity(UserEntity userEntity) {
        return PatchUserResponseDto.builder()
                .userId(userEntity.getUserId())
                .username(userEntity.getUsername())
                .profileImage(userEntity.getProfileImage())
                .build();
    }
}
