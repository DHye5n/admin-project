package dh.project.backend.repository;

import dh.project.backend.domain.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {

    List<ImageEntity> findByBoard_BoardId(Long boardId);
}
