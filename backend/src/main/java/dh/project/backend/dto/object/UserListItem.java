package dh.project.backend.dto.object;

import dh.project.backend.domain.UserListViewEntity;
import dh.project.backend.enums.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class UserListItem {

    private Long userId;
    private String email;
    private String username;
    private String profileImage;
    private int followersCount;
    private int followingsCount;
    private Role role;

    @Builder
    public UserListItem(Long userId, String email, String username, String profileImage, int followersCount, int followingsCount, Role role) {
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.profileImage = profileImage;
        this.followersCount = followersCount;
        this.followingsCount = followingsCount;
        this.role = role;
    }

    public static List<UserListItem> fromEntityList(List<UserListViewEntity> users) {
        return users.stream()
                .map(user -> UserListItem.builder()
                        .userId(user.getUserId())
                        .email(user.getEmail())
                        .username(user.getUsername())
                        .profileImage(user.getProfileImage())
                        .followersCount(user.getFollowersCount())
                        .followingsCount(user.getFollowingsCount())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList());
    }
}
