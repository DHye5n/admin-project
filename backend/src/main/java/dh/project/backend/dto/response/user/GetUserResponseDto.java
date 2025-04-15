package dh.project.backend.dto.response.user;

import dh.project.backend.domain.UserEntity;
import dh.project.backend.enums.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
public class GetUserResponseDto {

    private final Long userId;
    private final String email;
    private final String username;
    private final String profileImage;
    private final String phone;
    private final int followersCount;
    private final int followingsCount;
    private final boolean following;
    private final Role role;

    @Builder
    public GetUserResponseDto(Long userId, String email, String username, String profileImage,
                              String phone, int followersCount, int followingsCount, boolean following, Role role) {
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.profileImage = profileImage != null ? profileImage : "";
        this.phone = phone;
        this.followersCount = followersCount;
        this.followingsCount = followingsCount;
        this.following = following;
        this.role = role;
    }

    public static GetUserResponseDto fromEntity(UserEntity userEntity, boolean following) {
        return GetUserResponseDto.builder()
                .userId(userEntity.getUserId())
                .email(userEntity.getEmail())
                .username(userEntity.getUsername())
                .profileImage(userEntity.getProfileImage() != null ? userEntity.getProfileImage() : "")
                .phone(userEntity.getPhone())
                .followersCount(userEntity.getFollowersCount())
                .followingsCount(userEntity.getFollowingsCount())
                .following(following)
                .role(userEntity.getRole())
                .build();
    }
}
