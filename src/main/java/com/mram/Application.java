package com.mram;

import com.mram.service.CachingService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
@EntityScan(basePackageClasses = {
		Application.class,
		Jsr310JpaConverters.class
})
public class Application implements CommandLineRunner {

	private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm:ss");

	@PostConstruct
	void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
	}

	@Bean
	public RestTemplate getRestTemplate() {
		return new RestTemplate();
	}

	@Autowired
	CachingService cachingService;

	@Override
	public void run(String... args) throws Exception {
		/*
		 * System.out.println("Start: " + formatter.format(LocalDateTime.now()));
		 * cachingService.getCommonList("banks");
		 * cachingService.getCommonList("organizations");
		 * cachingService.getCommonList("suppliers");
		 * cachingService.getCommonList("sourceTypes");
		 * cachingService.getCommonList("provinces");
		 * cachingService.getCommonList("ecoTypes");
		 * cachingService.getCommonList("main-sector");
		 * cachingService.getCommonList("sub-sector");
		 * cachingService.getCommonList("inv-category");
		 * cachingService.getCommonList("governors");
		 * System.out.println("End: " + formatter.format(LocalDateTime.now()));
		 */
	}
}
