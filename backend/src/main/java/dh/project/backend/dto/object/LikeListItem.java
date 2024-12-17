package dh.project.backend.dto.object;

import dh.project.backend.domain.LikeEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


/**
 *  공통 객체 DTO 클래스
 * */

@Getter
@NoArgsConstructor
public class LikeListItem {

    private String email;
    private String username;
    private String profileImage;

    @Builder
    public LikeListItem(String email, String username, String profileImage) {
        this.email = email;
        this.username = username;
        this.profileImage = profileImage;
    }

    public static LikeListItem fromEntity(LikeEntity like) {
        return LikeListItem.builder()
                .email(like.getUser().getEmail())
                .username(like.getUser().getUsername())
                .profileImage(like.getUser().getProfileImage())
                .build();
    }
}
