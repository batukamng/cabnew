/*
package com.mram;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.text.NumberFormat;

@Configuration
public class AppStatus implements CommandLineRunner {

    private final static Logger logger = LoggerFactory.getLogger(AppStatus.class);

    @Value("${spring.application.name:}")
    private String AppName;

    @Value("${server.port:}")
    private String AppPort;

    @Override
    public void run(String... args) throws Exception {

        Runtime runtime = Runtime.getRuntime();

        final NumberFormat format = NumberFormat.getInstance();

        final long maxMemory = runtime.maxMemory();
        final long allocatedMemory = runtime.totalMemory();
        final long freeMemory = runtime.freeMemory();
        final long mb = 1024 * 1024;
        final String mega = " MB";

        logger.info("========================== Memory Info ==========================");
        logger.info("Free memory: " + format.format(freeMemory / mb) + mega);
        logger.info("Allocated memory: " + format.format(allocatedMemory / mb) + mega);
        logger.info("Max memory: " + format.format(maxMemory / mb) + mega);
        logger.info("Total free memory: " + format.format((freeMemory + (maxMemory - allocatedMemory)) / mb) + mega);
        logger.info("=================================================================");

        logger.warn(" http://localhost:{}/swagger-ui/ ",AppPort);

    }
}
*/
