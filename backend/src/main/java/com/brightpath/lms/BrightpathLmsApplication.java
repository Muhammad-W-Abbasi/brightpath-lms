package com.brightpath.lms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BrightpathLmsApplication {

    private static final Logger log = LoggerFactory.getLogger(BrightpathLmsApplication.class);

    public static void main(String[] args) {
        String activeProfile = System.getenv("SPRING_PROFILES_ACTIVE");
        if (activeProfile == null || activeProfile.trim().isEmpty()) {
            System.setProperty("spring.profiles.active", "dev");
            log.warn("SPRING_PROFILES_ACTIVE is not set. Defaulting to 'dev' profile.");
        }

        SpringApplication.run(BrightpathLmsApplication.class, args);
    }
}
