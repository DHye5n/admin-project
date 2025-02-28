package dh.project.backend.dto.response.user;

import dh.project.backend.domain.FollowEntity;
import dh.project.backend.dto.object.UserListItem;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class GetFollowerListResponseDto {

    private final List<UserListItem> followerList;

    @Builder
    public GetFollowerListResponseDto(List<UserListItem> followerList) {
        this.followerList = followerList;
    }

    public static GetFollowerListResponseDto fromEntity(List<FollowEntity> followEntities ) {
        List<UserListItem> followingList = followEntities.stream()
                .map(follow -> UserListItem.builder()
                        .userId(follow.getFollower().getUserId())
                        .email(follow.getFollower().getEmail())
                        .username(follow.getFollower().getUsername())
                        .profileImage(follow.getFollower().getProfileImage())
                        .followersCount(follow.getFollower().getFollowersCount())
                        .followingsCount(follow.getFollower().getFollowingsCount())
                        .build())
                .collect(Collectors.toList());

        return new GetFollowerListResponseDto(followingList);
    }
}
