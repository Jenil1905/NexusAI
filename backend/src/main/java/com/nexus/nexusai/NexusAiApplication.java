package com.nexus.nexusai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.nexus.nexusai.model.Project;
import com.nexus.nexusai.repository.ProjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class NexusAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(NexusAiApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(ProjectRepository repository) {
		return (args) -> {
			if (repository.count() == 0) {
				repository.save(new Project("Hackathon Project", "Demo project for AI features"));
				System.out.println("Seeded database with 'Hackathon Project'");
			}
		};
	}
}
