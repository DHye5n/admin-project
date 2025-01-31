package dh.project.backend.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Immutable
@Table(name = "user_list_view")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity(name = "user_list_view")
public class UserListViewEntity {

    @Id
    private Long userId;

    @Column(length = 30)
    private String email;
    @Column(length = 10)
    private String username;

    private String profileImage;

    private int followersCount;

    private int followingsCount;

    @Builder
    public UserListViewEntity(Long userId, String email, String username, String profileImage, int followersCount, int followingsCount) {
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.profileImage = profileImage;
        this.followersCount = followersCount;
        this.followingsCount = followingsCount;
    }

    public static UserListViewEntity fromEntity(UserEntity user) {
        return UserListViewEntity.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .username(user.getUsername())
                .profileImage(user.getProfileImage())
                .followersCount(user.getFollowersCount())
                .followingsCount(user.getFollowingsCount())
                .build();
    }
}
