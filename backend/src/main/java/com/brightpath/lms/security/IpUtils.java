package com.brightpath.lms.security;

import jakarta.servlet.http.HttpServletRequest;

import java.util.regex.Pattern;

public final class IpUtils {

    private static final Pattern IP_PATTERN = Pattern.compile("^[0-9a-fA-F:.]+$");

    private IpUtils() {
    }

    public static String getClientIp(HttpServletRequest request) {
        String remoteAddr = request.getRemoteAddr();
        String forwarded = request.getHeader("X-Forwarded-For");

        if (forwarded != null && !forwarded.isBlank() && isTrustedProxy(remoteAddr)) {
            String[] ips = forwarded.split(",");
            String ip = ips[0].trim();
            if (IP_PATTERN.matcher(ip).matches()) {
                return ip;
            }
        }

        return remoteAddr;
    }

    private static boolean isTrustedProxy(String remoteAddr) {
        if (remoteAddr == null || remoteAddr.isBlank()) {
            return false;
        }
        return remoteAddr.equals("127.0.0.1")
            || remoteAddr.equals("::1")
            || remoteAddr.startsWith("10.")
            || remoteAddr.startsWith("192.168.")
            || remoteAddr.matches("^172\\.(1[6-9]|2[0-9]|3[0-1])\\..*");
    }
}
