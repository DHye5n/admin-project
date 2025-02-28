package dh.project.backend.repository;

import dh.project.backend.domain.UserListViewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserListViewRepository extends JpaRepository<UserListViewEntity, Long> {

    @Query(value =
            "SELECT u.user_id AS user_id, " +
                    "       u.email AS email, " +
                    "       u.username AS username, " +
                    "       u.profile_image AS profile_image, " +
                    "       u.followers_count AS followers_count, " +
                    "       u.followings_count AS followings_count, " +
                    "       u.role AS role " +
                    "FROM user u " +
                    "ORDER BY u.username ASC",
            nativeQuery = true)
    List<UserListViewEntity> findAllUsers();

}
