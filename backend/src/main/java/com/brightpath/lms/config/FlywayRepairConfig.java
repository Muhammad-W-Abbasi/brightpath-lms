package com.brightpath.lms.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("prod")
/**
 * FlywayRepairConfig runs {@code flyway.repair()} before migration when explicitly enabled.
 * This is intended for recovery scenarios when migration checksums change after a migration
 * has already been applied — for example, during development hotfixes.
 *
 * <p>Activation requires {@code app.flyway.repair-on-startup=true} to be set manually.
 * It should not remain enabled in normal production deployments, as checksum failures
 * can indicate unintended schema changes.
 */
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
