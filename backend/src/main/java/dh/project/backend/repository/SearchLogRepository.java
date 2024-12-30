package dh.project.backend.repository;

import dh.project.backend.domain.SearchLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SearchLogRepository extends JpaRepository<SearchLogEntity, Long> {

    @Query(value =
            "SELECT s.search_word, COUNT(s.search_word) AS searchCount " +
                    "FROM search_log s " +
                    "GROUP BY s.search_word " +
                    "ORDER BY searchCount DESC",
            nativeQuery = true)
    List<String> findPopularSearchWords();
}
