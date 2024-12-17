package dh.project.backend.dto.object;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


/**
 *  공통 객체 DTO 클래스
 * */

@Getter
@NoArgsConstructor
public class CommentListItem {

    private String username;
    private String profileImage;
    private LocalDateTime createdDate;
    private String comment;

    @Builder
    public CommentListItem(String username, String profileImage, LocalDateTime createdDate, String comment) {
        this.username = username;
        this.profileImage = profileImage;
        this.createdDate = createdDate;
        this.comment = comment;
    }
}
