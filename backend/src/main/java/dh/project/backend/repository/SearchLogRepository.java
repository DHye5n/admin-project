package dh.project.backend.repository;

import dh.project.backend.domain.SearchLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SearchLogRepository extends JpaRepository<SearchLogEntity, Long> {

    @Query(value =
            "SELECT s.search_word, COUNT(s.search_word) AS searchCount " +
                    "FROM search_log s " +
                    "WHERE relation IS FALSE " +
                    "GROUP BY s.search_word " +
                    "ORDER BY searchCount DESC " +
                    "LIMIT 10 ",
            nativeQuery = true)
    List<String> findPopularWords();

    @Query(value =
            "SELECT s.relation_word, COUNT(s.relation_word) AS relationCount " +
                    "FROM search_log s " +
                    "WHERE search_word = ?1 " +
                    "AND relation_word IS NOT NULL " +
                    "GROUP BY s.relation_word " +
                    "ORDER BY relationCount DESC " +
                    "LIMIT 10 ",
            nativeQuery = true)
    List<String> findRelationWords(String searchWord);
}
