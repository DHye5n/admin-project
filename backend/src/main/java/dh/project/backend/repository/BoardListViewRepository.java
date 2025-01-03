package dh.project.backend.repository;

import dh.project.backend.domain.BoardListViewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardListViewRepository extends JpaRepository<BoardListViewEntity, Long> {

    @Query(value =
            "SELECT b.board_id AS board_id, " +
                    "b.title AS title, " +
                    "b.content AS content, " +
                    "(SELECT image_url FROM image i WHERE i.board_id = b.board_id ORDER BY i.image_id ASC LIMIT 1) AS title_image, " +
                    "b.like_count AS like_count, " +
                    "b.comment_count AS comment_count, " +
                    "b.view_count AS view_count, " +
                    "DATE_FORMAT(b.created_date, '%Y-%m-%d %H:%i:%s') AS created_date, " +
                    "u.username AS username, " +
                    "u.profile_image AS profile_image " +
                    "FROM board b " +
                    "INNER JOIN user u ON b.user_id = u.user_id " +
                    "ORDER BY b.created_date DESC",
            nativeQuery = true)
    List<BoardListViewEntity> findLatestBoards();

    @Query(value =
            "SELECT b.board_id AS board_id, " +
                    "b.title AS title, " +
                    "b.content AS content, " +
                    "(SELECT image_url FROM image i WHERE i.board_id = b.board_id ORDER BY i.image_id ASC LIMIT 1) AS title_image, " +
                    "b.like_count AS like_count, " +
                    "b.comment_count AS comment_count, " +
                    "b.view_count AS view_count, " +
                    "DATE_FORMAT(b.created_date, '%Y-%m-%d %H:%i:%s') AS created_date, " +
                    "u.username AS username, " +
                    "u.profile_image AS profile_image " +
                    "FROM board b " +
                    "INNER JOIN user u ON b.user_id = u.user_id " +
                    "WHERE b.created_date >= NOW() - INTERVAL 1 WEEK " +
                    "ORDER BY b.view_count DESC " +
                    "LIMIT 3",
            nativeQuery = true)
    List<BoardListViewEntity> findTop3Boards();

    @Query(value =
            "SELECT b.board_id AS board_id, " +
                    "b.title AS title, " +
                    "b.content AS content, " +
                    "(SELECT i.image_url FROM image i WHERE i.board_id = b.board_id ORDER BY i.image_id ASC LIMIT 1) AS title_image, " +
                    "b.like_count AS like_count, " +
                    "b.comment_count AS comment_count, " +
                    "b.view_count AS view_count, " +
                    "DATE_FORMAT(b.created_date, '%Y-%m-%d %H:%i:%s') AS created_date, " +
                    "u.username AS username, " +
                    "u.profile_image AS profile_image " +
                    "FROM board b " +
                    "INNER JOIN user u ON b.user_id = u.user_id " +
                    "WHERE (LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')) " +
                    "OR LOWER(b.content) LIKE LOWER(CONCAT('%', :content, '%'))) " +
                    "ORDER BY b.created_date DESC",
            nativeQuery = true)
    List<BoardListViewEntity> findSearchBoards(@Param("title") String title, @Param("content") String content);

}
