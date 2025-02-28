package dh.project.backend.repository;

import dh.project.backend.domain.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {

    @Query("SELECT m FROM message m " +
            "JOIN FETCH m.sender sender " +
            "JOIN FETCH m.receiver receiver " +
            "WHERE (m.sender.userId = :senderId AND m.receiver.userId = :receiverId) " +
            "   OR (m.sender.userId = :receiverId AND m.receiver.userId = :senderId) " +
            "ORDER BY m.createdDate ASC")
    List<MessageEntity> getMessagesBetweenUsers(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

}
