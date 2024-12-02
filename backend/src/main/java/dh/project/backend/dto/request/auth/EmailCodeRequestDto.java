package dh.project.backend.dto.request.auth;

import dh.project.backend.domain.EmailEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmailCodeRequestDto {

    private String email;
    private String verificationCode;
    private LocalDateTime expiryDate;

    @Builder
    public EmailCodeRequestDto(String email, String verificationCode, LocalDateTime expiryDate) {
        this.email = email;
        this.verificationCode = verificationCode;
        this.expiryDate = expiryDate;
    }

    public EmailEntity toEntity() {
        return EmailEntity.builder()
                .email(email)
                .verificationCode(verificationCode)
                .expiryDate(expiryDate)
                .build();
    }

}
