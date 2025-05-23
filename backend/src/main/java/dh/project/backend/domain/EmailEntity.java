package dh.project.backend.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;


@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "email")
@Getter
@Entity(name = "email")
public class EmailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "email_id")
    private Long emailId;

    @Column(name = "email", length = 30, nullable = false, unique = true)
    private String email;

    @Column(name = "verification_code", nullable = false)
    private String verificationCode;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Builder
    public EmailEntity(String email, String verificationCode, LocalDateTime expiryDate) {
        this.email = email;
        this.verificationCode = verificationCode;
        this.expiryDate = expiryDate;
    }

    public void updateVerificationCode(String verificationCode, LocalDateTime expiryDate) {
        this.verificationCode = verificationCode;
        this.expiryDate = expiryDate;
    }
}
