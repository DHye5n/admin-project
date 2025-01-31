package dh.project.backend.dto.response.user;

import dh.project.backend.domain.FollowEntity;
import dh.project.backend.dto.object.UserListItem;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class GetFollowingListResponseDto {

    private final List<UserListItem> followList;

    @Builder
    public GetFollowingListResponseDto(List<UserListItem> followList) {
        this.followList = followList;
    }

    public static GetFollowingListResponseDto fromEntity(List<FollowEntity> followEntities ) {
        List<UserListItem> followingList = followEntities.stream()
                .map(follow -> UserListItem.builder()
                        .userId(follow.getFollowing().getUserId())
                        .email(follow.getFollowing().getEmail())
                        .username(follow.getFollowing().getUsername())
                        .profileImage(follow.getFollowing().getProfileImage())
                        .followersCount(follow.getFollowing().getFollowersCount())
                        .followingsCount(follow.getFollowing().getFollowingsCount())
                        .build())
                .collect(Collectors.toList());

        return new GetFollowingListResponseDto(followingList);
    }
}
