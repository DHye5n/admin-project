package dh.project.backend.dto.response.auth;

import lombok.Builder;
import lombok.Getter;

@Getter
public class SignInResponseDto {

    private final String token;
    private final int expirationTime;

    @Builder
    public SignInResponseDto(String token, int expirationTime) {
        this.token = token;
        this.expirationTime = expirationTime;
    }


    public static SignInResponseDto fromEntity(String token, int expirationTime) {
        return SignInResponseDto.builder()
                .token(token)
                .expirationTime(expirationTime)
                .build();
    }
}
