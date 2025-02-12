package dh.project.backend.dto.request.user;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PatchUserRequestDto {

    private Long userId;
    private String username;
    private String profileImage;

    @Builder
    public PatchUserRequestDto(Long userId, String username, String profileImage) {
        this.userId = userId;
        this.username = username;
        this.profileImage = profileImage;
    }
}
