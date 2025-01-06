package dh.project.backend.repository;

import dh.project.backend.domain.SearchLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SearchLogRepository extends JpaRepository<SearchLogEntity, Long> {

    @Query(value =
            "SELECT s.search_word " +
                    "FROM search_log s " +
                    "WHERE relation IS FALSE " +
                    "GROUP BY s.search_word " +
                    "ORDER BY COUNT(s.search_word) DESC " +
                    "LIMIT 10 ",
            nativeQuery = true)
    List<String> findPopularWords();

    @Query(value =
            "SELECT s.relation_word " +
                    "FROM search_log s " +
                    "WHERE search_word = ?1 " +
                    "AND relation_word IS NOT NULL " +
                    "GROUP BY s.relation_word " +
                    "ORDER BY COUNT(s.relation_word) DESC " +
                    "LIMIT 10 ",
            nativeQuery = true)
    List<String> findRelationWords(String searchWord);
}
