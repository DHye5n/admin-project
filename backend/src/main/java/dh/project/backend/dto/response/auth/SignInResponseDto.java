package dh.project.backend.dto.response.auth;

import lombok.Builder;
import lombok.Getter;

@Getter
public class SignInResponseDto {

    private final String accessToken;
    private final int expirationTime;

    @Builder
    public SignInResponseDto(String accessToken, int expirationTime) {
        this.accessToken = accessToken;
        this.expirationTime = expirationTime;
    }


    public static SignInResponseDto fromEntity(String accessToken, int expirationTime) {
        return SignInResponseDto.builder()
                .accessToken(accessToken)
                .expirationTime(expirationTime)
                .build();
    }
}
