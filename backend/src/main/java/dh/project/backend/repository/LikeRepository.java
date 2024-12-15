package dh.project.backend.repository;

import dh.project.backend.domain.LikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {

    Optional<LikeEntity> findByBoard_BoardIdAndUser_Username(Long boardId, String username);

    @Modifying
    @Query("UPDATE board b SET b.likeCount = b.likeCount + 1 WHERE b.boardId = :boardId")
    void increaseLikeCount(@Param("boardId") Long boardId);

    @Modifying
    @Query("UPDATE board b SET b.likeCount = b.likeCount - 1 WHERE b.boardId = :boardId")
    void decreaseLikeCount(@Param("boardId") Long boardId);
}
