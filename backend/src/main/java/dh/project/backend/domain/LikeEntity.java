package dh.project.backend.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Table(name = "\"like\"",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "board_id"})
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity(name = "like")
public class LikeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long likeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private BoardEntity board;

    @Builder
    public LikeEntity(UserEntity user, BoardEntity board) {
        this.user = user;
        this.board = board;
    }
}
