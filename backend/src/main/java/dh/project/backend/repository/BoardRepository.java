package dh.project.backend.repository;

import dh.project.backend.domain.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BoardRepository extends JpaRepository<BoardEntity, Long> {

    @Modifying
    @Query("UPDATE board b SET b.viewCount = b.viewCount + 1 WHERE b.boardId = :boardId")
    int increaseViewCount(@Param("boardId") Long boardId);

}
