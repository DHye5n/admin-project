package dh.project.backend.dto.response.user;

import dh.project.backend.domain.UserEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class GetUserResponseDto {

    private final String email;
    private final String username;
    private final String profileImage;
    private final String phone;

    @Builder
    public GetUserResponseDto(String email, String username, String profileImage, String phone) {
        this.email = email;
        this.username = username;
        this.profileImage = profileImage;
        this.phone = phone;
    }

    public static GetUserResponseDto fromEntity(UserEntity userEntity) {
        return GetUserResponseDto.builder()
                .email(userEntity.getEmail())
                .username(userEntity.getUsername())
                .profileImage(userEntity.getProfileImage())
                .phone(userEntity.getPhone())
                .build();
    }
}
