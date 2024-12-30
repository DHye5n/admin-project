package dh.project.backend.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Table(name = "search_log")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity(name = "search_log")
public class SearchLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long searchLogId;

    private String searchWord;

    private String relationWord;

    private boolean relation;

    @Builder
    public SearchLogEntity(Long searchLogId, String searchWord, String relationWord, boolean relation) {
        this.searchLogId = searchLogId;
        this.searchWord = searchWord;
        this.relationWord = relationWord;
        this.relation = relation;
    }
}
