package dh.project.backend.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Table(name = "message")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity(name = "message")
public class MessageEntity extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private UserEntity sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private UserEntity receiver;

    @Column(nullable = false)
    private String message;

    @Builder
    public MessageEntity(UserEntity sender, UserEntity receiver, String message) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
    }

}
