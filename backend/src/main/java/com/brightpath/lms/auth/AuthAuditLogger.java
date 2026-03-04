package com.brightpath.lms.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public class AuthAuditLogger {

    private static final Logger log = LoggerFactory.getLogger(AuthAuditLogger.class);

    public void logEvent(String eventType,
                         String requestId,
                         UUID userId,
                         String emailHash,
                         String ipAddress,
                         String userAgent,
                         String outcome) {
        // Normalize untrusted strings to prevent log injection and preserve parser-friendly audit logs.
        String safeEventType = sanitizeForLog(eventType);
        String safeRequestId = sanitizeForLog(requestId);
        String safeEmailHash = sanitizeForLog(emailHash);
        String safeIpAddress = sanitizeForLog(ipAddress);
        String safeUserAgent = sanitizeForLog(userAgent);
        String safeOutcome = sanitizeForLog(outcome);

        log.info(
            "eventType={} timestamp={} requestId={} userId={} emailHash={} ip={} userAgent=\"{}\" outcome={}",
            safeEventType,
            Instant.now(),
            safeRequestId,
            userId,
            safeEmailHash,
            safeIpAddress,
            safeUserAgent,
            safeOutcome
        );
    }

    private static String sanitizeForLog(String value) {
        if (value == null) {
            return "null";
        }

        String cleaned = value.replaceAll("[\\r\\n\\t]", "_");

        if (cleaned.length() > 256) {
            cleaned = cleaned.substring(0, 256);
        }

        return cleaned;
    }
}
