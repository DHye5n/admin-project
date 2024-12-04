package dh.project.backend.dto.response.user;

import dh.project.backend.domain.UserEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class SignInUserResponseDto {

    private final String email;
    private final String username;
    private final String profileImage;

    @Builder
    public SignInUserResponseDto(String email, String username, String profileImage) {
        this.email = email;
        this.username = username;
        this.profileImage = profileImage;
    }

    public static SignInUserResponseDto fromEntity(UserEntity userEntity) {
        return SignInUserResponseDto.builder()
                .email(userEntity.getEmail())
                .username(userEntity.getUsername())
                .profileImage(userEntity.getProfileImage())
                .build();
    }
}
