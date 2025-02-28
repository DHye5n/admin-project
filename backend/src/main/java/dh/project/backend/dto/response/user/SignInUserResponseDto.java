package dh.project.backend.dto.response.user;

import dh.project.backend.domain.UserEntity;
import dh.project.backend.enums.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
public class SignInUserResponseDto {

    private final Long userId;
    private final String email;
    private final String username;
    private final String profileImage;
    private final String phone;
    private final Role role;

    @Builder
    public SignInUserResponseDto(Long userId, String email, String username, String profileImage, String phone, Role role) {
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.profileImage = profileImage;
        this.phone = phone;
        this.role = role;
    }

    public static SignInUserResponseDto fromEntity(UserEntity userEntity) {
        return SignInUserResponseDto.builder()
                .userId(userEntity.getUserId())
                .email(userEntity.getEmail())
                .username(userEntity.getUsername())
                .profileImage(userEntity.getProfileImage() != null ? userEntity.getProfileImage() : null)
                .phone(userEntity.getPhone())
                .role(userEntity.getRole())
                .build();
    }
}
