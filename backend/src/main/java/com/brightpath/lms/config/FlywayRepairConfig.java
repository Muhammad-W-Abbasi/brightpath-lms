package com.brightpath.lms.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("prod")
public class FlywayRepairConfig {

    @Bean
    @ConditionalOnProperty(name = "app.flyway.repair-on-startup", havingValue = "true")
    public FlywayMigrationStrategy flywayRepairThenMigrateStrategy() {
        return flyway -> {
            flyway.repair();
            flyway.migrate();
        };
    }
}
