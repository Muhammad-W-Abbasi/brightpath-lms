package com.brightpath.lms.auth;

import org.springframework.stereotype.Component;

import java.time.Instant;
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
public class LoginAttemptLimiter {

    private static final int EMAIL_MAX_ATTEMPTS = 5;
    private static final int IP_MAX_ATTEMPTS = 20;
    private static final long WINDOW_SECONDS = 60;

    private final Map<String, AttemptState> emailAttempts = new ConcurrentHashMap<>();
    private final Map<String, AttemptState> ipAttempts = new ConcurrentHashMap<>();

    public RateLimitDecision evaluate(String emailHash, String ipAddress) {
        long now = Instant.now().getEpochSecond();
        long emailRetry = retryAfterIfLimited(emailAttempts, emailHash, EMAIL_MAX_ATTEMPTS, now);
        long ipRetry = retryAfterIfLimited(ipAttempts, ipAddress, IP_MAX_ATTEMPTS, now);

        long retryAfter = Math.max(emailRetry, ipRetry);
        return new RateLimitDecision(retryAfter > 0, retryAfter);
    }

    public void recordFailure(String emailHash, String ipAddress) {
        long now = Instant.now().getEpochSecond();
        increment(emailAttempts, emailHash, now);
        increment(ipAttempts, ipAddress, now);
    }

    public void reset(String emailHash, String ipAddress) {
        clear(emailAttempts, emailHash);
        clear(ipAttempts, ipAddress);
    }

    private long retryAfterIfLimited(Map<String, AttemptState> store, String key, int maxAttempts, long now) {
        AttemptState state = store.computeIfAbsent(key, ignored -> new AttemptState(now));
        synchronized (state) {
            refreshWindowIfNeeded(state, now);
            if (state.failures < maxAttempts) {
                return 0;
            }
            long elapsed = now - state.windowStartedAtEpochSec;
            long remaining = WINDOW_SECONDS - elapsed;
            return Math.max(1, remaining);
        }
    }

    private void increment(Map<String, AttemptState> store, String key, long now) {
        AttemptState state = store.computeIfAbsent(key, ignored -> new AttemptState(now));
        synchronized (state) {
            refreshWindowIfNeeded(state, now);
            state.failures++;
        }
    }

    private void clear(Map<String, AttemptState> store, String key) {
        store.remove(key);
    }

    private void refreshWindowIfNeeded(AttemptState state, long now) {
        if ((now - state.windowStartedAtEpochSec) >= WINDOW_SECONDS) {
            state.windowStartedAtEpochSec = now;
            state.failures = 0;
        }
    }

    public record RateLimitDecision(boolean limited, long retryAfterSeconds) {}

    private static final class AttemptState {
        private long windowStartedAtEpochSec;
        private int failures;

        private AttemptState(long windowStartedAtEpochSec) {
            this.windowStartedAtEpochSec = windowStartedAtEpochSec;
            this.failures = 0;
        }
    }
}
