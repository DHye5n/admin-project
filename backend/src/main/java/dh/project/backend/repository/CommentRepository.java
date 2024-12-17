package dh.project.backend.repository;

import dh.project.backend.domain.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    @Modifying
    @Query("UPDATE board b SET b.commentCount = b.commentCount + 1 WHERE b.boardId = :boardId")
    int increaseCommentCount(@Param("boardId") Long boardId);

}
