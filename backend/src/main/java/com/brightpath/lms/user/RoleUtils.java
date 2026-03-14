package com.brightpath.lms.user;

import java.util.Set;

public final class RoleUtils {

    private RoleUtils() {
    }

    public static boolean hasRole(Set<Role> roles, String roleName) {
        return roles != null && roles.stream().anyMatch(role -> roleName.equalsIgnoreCase(role.getName()));
    }

    public static String resolvePrimaryRole(Set<Role> roles) {
        if (hasRole(roles, "ADMIN")) {
            return "ADMIN";
        }
        if (hasRole(roles, "INSTRUCTOR")) {
            return "INSTRUCTOR";
        }
        return "STUDENT";
    }
}
