package dh.project.backend.repository;

import dh.project.backend.domain.SearchLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SearchLogRepository extends JpaRepository<SearchLogEntity, Long> {
}
