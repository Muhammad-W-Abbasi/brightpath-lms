package com.brightpath.lms.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/*
 * SECURITY NOTE:
 * This rate limiter uses in-memory storage (ConcurrentHashMap).
 * This is acceptable for a demo environment but is NOT cluster-safe.
 *
 * In a production deployment this should be replaced with a distributed
 * store such as Redis using Bucket4j RedisProxyManager or Spring Data Redis.
 *
 * Current design intentionally keeps implementation simple for the demo.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Bandwidth LIMIT = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        if (!isRateLimitedPath(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        Bucket bucket = buckets.computeIfAbsent(buildKey(request), key -> Bucket.builder().addLimit(LIMIT).build());
        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
            return;
        }

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", "60");
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"too_many_attempts\",\"message\":\"Too many login attempts. Please wait and try again.\"}");
    }

    private boolean isRateLimitedPath(String path) {
        return path.equals("/api/courses/join")
            || path.equals("/api/auth/login")
            || path.equals("/api/auth/register");
    }

    private String buildKey(HttpServletRequest request) {
        String ip = IpUtils.getClientIp(request);
        return ip + "|" + request.getRequestURI();
    }
}
