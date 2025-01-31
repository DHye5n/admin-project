package dh.project.backend.repository;

import dh.project.backend.domain.FollowEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<FollowEntity, Long> {

    Optional<FollowEntity> findByFollower_UserIdAndFollowing_UserId(Long followerId, Long followingId);

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END " +
            "FROM follow f " +
            "JOIN f.follower " +
            "JOIN f.following " +
            "WHERE f.follower.userId = :followerId AND f.following.userId = :followingId")
    boolean findFollowedUser(@Param("followerId") Long followerId, @Param("followingId") Long followingId);

    @Modifying
    @Query("UPDATE user u SET u.followersCount = u.followersCount + 1 WHERE u.userId = :followId")
    void increaseFollowerCount(@Param("followId") Long followId);

    @Modifying
    @Query("UPDATE user u SET u.followersCount = u.followersCount - 1 WHERE u.userId = :followId")
    void decreaseFollowerCount(@Param("followId") Long followId);

    @Modifying
    @Query("UPDATE user u SET u.followingsCount = u.followingsCount + 1 WHERE u.userId = :followId")
    void increaseFollowingCount(@Param("followId") Long followId);

    @Modifying
    @Query("UPDATE user u SET u.followingsCount = u.followingsCount - 1 WHERE u.userId = :followId")
    void decreaseFollowingCount(@Param("followId") Long followId);

    @Query("SELECT f FROM follow f JOIN FETCH f.following u WHERE f.follower.userId = :userId")
    List<FollowEntity> findFollowingsByUserId(@Param("userId") Long userId);

    @Query("SELECT f FROM follow f JOIN FETCH f.follower u WHERE f.following.userId = :userId")
    List<FollowEntity> findFollowersByUserId(@Param("userId") Long userId);

}
