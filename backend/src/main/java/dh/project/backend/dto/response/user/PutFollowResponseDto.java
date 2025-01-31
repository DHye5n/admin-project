package dh.project.backend.dto.response.user;

import dh.project.backend.domain.UserEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
public class PutFollowResponseDto {

    private final Long followId;
    private final String username;
    private final boolean following;

    @Builder
    public PutFollowResponseDto(Long followId, String username, boolean following) {
        this.followId = followId;
        this.username = username;
        this.following = following;
    }

    public static PutFollowResponseDto fromEntity(UserEntity user, boolean following) {
        return PutFollowResponseDto.builder()
                .followId(user.getUserId())
                .username(user.getUsername())
                .following(following)
                .build();
    }
}
