package dh.project.backend.repository;

import dh.project.backend.domain.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    @Modifying
    @Query("UPDATE board b SET b.commentCount = b.commentCount + 1 WHERE b.boardId = :boardId")
    int increaseCommentCount(@Param("boardId") Long boardId);

    @Query("SELECT c FROM comment c JOIN FETCH c.user u WHERE c.board.boardId = :boardId AND c.deletedDate IS NULL " +
            "ORDER BY CASE WHEN c.modifiedDate IS NOT NULL THEN c.modifiedDate ELSE c.createdDate END DESC")
    List<CommentEntity> findCommentsWithUserByBoardId(@Param("boardId") Long boardId);

    @Query("SELECT c FROM comment c LEFT JOIN FETCH c.user WHERE c.board.boardId = :boardId AND c.commentId = :commentId")
    Optional<CommentEntity> findByIdWithUser(@Param("boardId") Long boardId, @Param("commentId") Long commentId);
}
