package com.sg.reparos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SgPequenosReparosApplication {

	public static void main(String[] args) {
		SpringApplication.run(SgPequenosReparosApplication.class, args);
	}

}
