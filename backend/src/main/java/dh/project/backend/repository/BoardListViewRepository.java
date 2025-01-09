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
                    "i.image_url AS title_image, " +
                    "b.like_count AS like_count, " +
                    "b.comment_count AS comment_count, " +
                    "b.view_count AS view_count, " +
                    "DATE_FORMAT(b.created_date, '%Y-%m-%d %H:%i:%s') AS created_date, " +
                    "u.username AS username, " +
                    "u.profile_image AS profile_image " +
                    "FROM board b " +
                    "INNER JOIN user u ON b.user_id = u.user_id " +
                    "LEFT JOIN ( " +
                    "    SELECT board_id, MIN(image_id) AS min_image_id " +
                    "    FROM image " +
                    "    GROUP BY board_id " +
                    ") AS min_image ON b.board_id = min_image.board_id " +
                    "LEFT JOIN image i ON min_image.board_id = i.board_id AND min_image.min_image_id = i.image_id " +
                    "WHERE b.deleted_date IS NULL " +
                    "ORDER BY b.created_date DESC",
            nativeQuery = true)
    List<BoardListViewEntity> findLatestBoards();

    @Query(value =
            "SELECT b.board_id AS board_id, " +
                    "b.title AS title, " +
                    "b.content AS content, " +
                    "i.image_url AS title_image, " +
                    "b.like_count AS like_count, " +
                    "b.comment_count AS comment_count, " +
                    "b.view_count AS view_count, " +
                    "DATE_FORMAT(b.created_date, '%Y-%m-%d %H:%i:%s') AS created_date, " +
                    "u.username AS username, " +
                    "u.profile_image AS profile_image " +
                    "FROM board b " +
                    "INNER JOIN user u ON b.user_id = u.user_id " +
                    "LEFT JOIN ( " +
                    "    SELECT board_id, MIN(image_id) AS min_image_id " +
                    "    FROM image " +
                    "    GROUP BY board_id " +
                    ") AS min_image ON b.board_id = min_image.board_id " +
                    "LEFT JOIN image i ON min_image.board_id = i.board_id AND min_image.min_image_id = i.image_id " +
                    "WHERE b.created_date >= NOW() - INTERVAL 1 WEEK " +
                    "  AND b.deleted_date IS NULL " +
                    "ORDER BY b.view_count DESC " +
                    "LIMIT 3",
            nativeQuery = true)
    List<BoardListViewEntity> findTop3Boards();

    @Query(value =
            "SELECT b.board_id AS board_id, " +
                    "b.title AS title, " +
                    "b.content AS content, " +
                    "i.image_url AS title_image, " +
                    "b.like_count AS like_count, " +
                    "b.comment_count AS comment_count, " +
                    "b.view_count AS view_count, " +
                    "DATE_FORMAT(b.created_date, '%Y-%m-%d %H:%i:%s') AS created_date, " +
                    "u.username AS username, " +
                    "u.profile_image AS profile_image " +
                    "FROM board b " +
                    "INNER JOIN user u ON b.user_id = u.user_id " +
                    "LEFT JOIN ( " +
                    "    SELECT board_id, MIN(image_id) AS min_image_id " +
                    "    FROM image " +
                    "    GROUP BY board_id " +
                    ") AS min_image ON b.board_id = min_image.board_id " +
                    "LEFT JOIN image i ON min_image.board_id = i.board_id AND min_image.min_image_id = i.image_id " +
                    "WHERE (LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')) " +
                    "OR LOWER(b.content) LIKE LOWER(CONCAT('%', :content, '%'))) " +
                    "AND b.deleted_date IS NULL " +
                    "ORDER BY b.created_date DESC",
            nativeQuery = true)
    List<BoardListViewEntity> findSearchBoards(@Param("title") String title, @Param("content") String content);

    @Query(value =
            "SELECT b.board_id AS board_id, " +
                    "b.title AS title, " +
                    "b.content AS content, " +
                    "i.image_url AS title_image, " +
                    "b.like_count AS like_count, " +
                    "b.comment_count AS comment_count, " +
                    "b.view_count AS view_count, " +
                    "DATE_FORMAT(b.created_date, '%Y-%m-%d %H:%i:%s') AS created_date, " +
                    "u.username AS username, " +
                    "u.profile_image AS profile_image " +
                    "FROM board b " +
                    "INNER JOIN user u ON b.user_id = u.user_id " +
                    "LEFT JOIN ( " +
                    "    SELECT board_id, MIN(image_id) AS min_image_id " +
                    "    FROM image " +
                    "    GROUP BY board_id " +
                    ") AS min_image ON b.board_id = min_image.board_id " +
                    "LEFT JOIN image i ON min_image.board_id = i.board_id AND min_image.min_image_id = i.image_id " +
                    "WHERE b.user_id = :userId " +
                    "AND b.deleted_date IS NULL " +
                    "ORDER BY b.created_date DESC",
            nativeQuery = true)
    List<BoardListViewEntity> findUserBoardList(@Param("userId") Long userId);
}
