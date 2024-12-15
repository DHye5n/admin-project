package dh.project.backend.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Table(name = "board")
@SQLDelete(sql = "UPDATE \"board\" SET deleted_date = CURRENT_TIMESTAMP WHERE board_id = ?")
@Where(clause = "deleted_date IS NULL")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity(name = "board")
public class BoardEntity extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boardId;

    @Column(length = 50, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private int likeCount = 0;

    private int commentCount = 0;

    private int viewCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<CommentEntity> comments = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ImageEntity> images = new ArrayList<>();

    @Builder
    public BoardEntity(String title, String content, int likeCount, int commentCount, int viewCount, UserEntity user) {
        this.title = title;
        this.content = content;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.viewCount = viewCount;
        this.user = user;
    }

}
