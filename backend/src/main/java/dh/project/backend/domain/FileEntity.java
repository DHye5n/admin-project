package dh.project.backend.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Table(name = "file")
@SQLDelete(sql = "UPDATE \"file\" SET deleted_date = CURRENT_TIMESTAMP WHERE file_id = ?")
@Where(clause = "deleted_date IS NULL")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity(name = "file")
public class FileEntity extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;

    @Column(length = 100)
    private String fileName;

    private String fileUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private BoardEntity board;

    @Builder
    public FileEntity(String fileName, String fileUrl, BoardEntity board) {
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.board = board;
    }
}
