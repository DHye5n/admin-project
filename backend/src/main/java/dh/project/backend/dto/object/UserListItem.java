package dh.project.backend.dto.object;

import dh.project.backend.domain.UserListViewEntity;
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

    @Builder
    public UserListItem(Long userId, String email, String username, String profileImage, int followersCount, int followingsCount) {
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.profileImage = profileImage;
        this.followersCount = followersCount;
        this.followingsCount = followingsCount;
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
                        .build())
                .collect(Collectors.toList());
    }
}
