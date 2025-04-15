package dh.project.backend.service;

import dh.project.backend.dto.response.auth.SignInResponseDto;
import dh.project.backend.service.principal.user.PrincipalDetails;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Service
public class JwtService {


    private final SecretKey key;

    public JwtService(@Value("${jwt.secret-key}") String key) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(key));
    }

    public String generateToken(String subject, long expirationTime) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationTime);
        return Jwts.builder()
                .subject(subject)
                .signWith(key)
                .issuedAt(now)
                .expiration(exp)
                .compact();
    }

    public SignInResponseDto generateAccessToken(PrincipalDetails principalDetails) {
        String accessToken = generateToken(principalDetails.getEmail(), 1000 * 60 * 60);

        int expirationTime = 3600;
        return SignInResponseDto.fromEntity(accessToken, expirationTime);
    }

//    public String generateAccessTokenForOAuth2(OAuth2UserDetails oAuth2UserDetails) {
//        String accessToken = generateToken(oAuth2UserDetails.getEmail(), 1000 * 60 * 60);
//
//        int expirationTime = 3600;
//        return accessToken + ":" + expirationTime;
//    }

    public String getUsername(String accessToken) {
        return getSubject(accessToken);
    }

    private String getSubject(String token) {

        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        } catch (ExpiredJwtException e) {
            log.error("Token has expired: {}", e.getMessage());
            throw e;
        } catch (JwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            throw e;
        }
    }

    public boolean validateAccessToken(String accessToken) {
        try {
            getSubject(accessToken);  // 토큰이 유효한지 확인
            return true;  // 유효한 경우
        } catch (JwtException e) {
            log.error("Invalid access token: {}", e.getMessage());
            return false;  // 유효하지 않은 경우
        }
    }

    public boolean validateRefreshToken(String refreshToken) {
        try {
            getSubject(refreshToken);  // 리프레시 토큰의 유효성 검증
            return true;  // 유효한 경우
        } catch (JwtException e) {
            log.error("Invalid refresh token: {}", e.getMessage());
            return false;  // 유효하지 않은 경우
        }
    }

}
