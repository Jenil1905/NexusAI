package com.nexus.nexusai.controller;

import com.nexus.nexusai.model.Project;
import com.nexus.nexusai.model.Task;
import com.nexus.nexusai.repository.ProjectRepository;
import com.nexus.nexusai.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*") // For local hackathon development
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    @Autowired
    public ProjectController(ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable("id") Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    @PostMapping("/{id}/ask")
    public Map<String, String> askNexus(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        String question = payload.get("question");

        // 1. Fetch project tasks
        List<Task> tasks = taskRepository.findByProject_Id(id);

        // 2. Format context
        List<String> context = tasks.stream()
                .map(t -> String.format("Title: %s\nStatus: %s\nContent: %s\nDecision State: %s\n",
                        t.getTitle(), t.getStatus(), t.getContent(), t.getDecisionState()))
                .collect(Collectors.toList());

        // 3. POST to Python AI Service
        RestTemplate restTemplate = new RestTemplate();
        String aiServiceUrl = "https://nexusai-engine.onrender.com/ask";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> aiRequest = new HashMap<>();
        aiRequest.put("question", question);
        aiRequest.put("context", context);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(aiRequest, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(aiServiceUrl, entity, Map.class);
            Map<String, String> result = new HashMap<>();
            result.put("answer", (String) response.getBody().get("answer"));
            return result;
        } catch (Exception e) {
            System.err.println("Failed to reach AI Service: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("answer", "I am having trouble connecting to my AI core right now.");
            return error;
        }
    }
}
