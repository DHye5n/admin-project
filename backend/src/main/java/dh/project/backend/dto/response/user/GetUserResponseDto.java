package dh.project.backend.dto.response.user;

import dh.project.backend.domain.UserEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class GetUserResponseDto {

    private final String email;
    private final String username;
    private final String profileImage;

    @Builder
    public GetUserResponseDto(String email, String username, String profileImage) {
        this.email = email;
        this.username = username;
        this.profileImage = profileImage;
    }

    public static GetUserResponseDto fromEntity(UserEntity userEntity) {
        return GetUserResponseDto.builder()
                .email(userEntity.getEmail())
                .username(userEntity.getUsername())
                .profileImage(userEntity.getProfileImage())
                .build();
    }
}
