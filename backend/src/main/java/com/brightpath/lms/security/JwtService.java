package com.brightpath.lms.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private final String secret;
    private final long expirationSeconds;
    private SecretKey signingKey;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-seconds:3600}") long expirationSeconds) {
        this.secret = secret;
        this.expirationSeconds = expirationSeconds;
    }

    @PostConstruct
    public void validateSecret() {
        // Fail fast at startup so weak/invalid JWT secrets never reach runtime token operations.
        byte[] decoded;
        try {
            decoded = Decoders.BASE64.decode(secret);
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException(
                "JWT secret must be a valid base64 value. Configure APP_JWT_SECRET with a secure base64 secret.",
                ex
            );
        }

        if (decoded.length < 32) {
            throw new IllegalStateException(
                "JWT secret must be at least 256 bits (32 bytes). Configure APP_JWT_SECRET with a secure base64 value."
            );
        }

        this.signingKey = Keys.hmacShaKeyFor(decoded);
    }

    public String generateToken(String subject) {
        Instant now = Instant.now();
        // Keep token claims intentionally minimal: subject, issued-at, and expiration.
        return Jwts.builder()
            .subject(subject)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(expirationSeconds)))
            .signWith(signingKey)
            .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return username != null && username.equals(userDetails.getUsername());
        } catch (JwtException | IllegalArgumentException ex) {
            // Treat all parsing/signature errors as invalid tokens without leaking details.
            return false;
        }
    }
}
