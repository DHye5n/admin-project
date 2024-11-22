package dh.project.backend.service;

import dh.project.backend.service.auth.PrincipalDetails;
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

    public String generateToken(String subject) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + (1000 * 60 * 60));
        return Jwts.builder()
                .subject(subject)
                .signWith(key)
                .issuedAt(now)
                .expiration(exp)
                .compact();
    }

    public String generateAccessToken(PrincipalDetails principalDetails) {
        return generateToken(principalDetails.getUsername());
    }

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
}
