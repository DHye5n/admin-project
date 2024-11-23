package dh.project.backend.dto.object;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class CommentListItem {

    private String username;
    private String profileImage;
    private LocalDateTime createdAt;
    private String comment;

    @Builder
    public CommentListItem(String username, String profileImage, LocalDateTime createdAt, String comment) {
        this.username = username;
        this.profileImage = profileImage;
        this.createdAt = createdAt;
        this.comment = comment;
    }
}
