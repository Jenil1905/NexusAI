package com.nexus.nexusai.controller;

import com.nexus.nexusai.model.Task;
import com.nexus.nexusai.repository.TaskRepository;
import com.nexus.nexusai.service.JiraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository taskRepository;
    private final JiraService jiraService;

    @Autowired
    public TaskController(TaskRepository taskRepository, JiraService jiraService) {
        this.taskRepository = taskRepository;
        this.jiraService = jiraService;
    }

    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable("projectId") Long projectId) {
        return taskRepository.findByProject_Id(projectId);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        System.out.println("DEBUG: Receiving task creation request");
        System.out.println("DEBUG: Title: " + task.getTitle());
        System.out.println("DEBUG: Content: "
                + (task.getContent() != null ? task.getContent().substring(0, Math.min(task.getContent().length(), 50))
                        : "NULL"));
        System.out.println("DEBUG: Author: " + task.getAuthor());
        System.out.println("DEBUG: Deadline: " + task.getDeadline());
        System.out.println("DEBUG: Context: " + task.getContext());
        System.out.println("DEBUG: isAiDraft: " + task.isAiDraft());

        // Ensure status is set if not provided
        if (task.getStatus() == null) {
            task.setStatus("OPEN");
        }
        return taskRepository.save(task);
    }

    @PatchMapping("/{id}/status")
    public Task updateTaskStatus(@PathVariable("id") Long id, @RequestBody String status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Remove quotes if present from raw string body
        String cleanStatus = status.replace("\"", "");
        task.setStatus(cleanStatus);
        Task savedTask = taskRepository.save(task);

        // Sync to Jira if key exists
        if (savedTask.getJiraKey() != null) {
            try {
                jiraService.updateIssueStatus(savedTask.getJiraKey(), cleanStatus);
            } catch (Exception e) {
                System.err.println("Failed to sync status to Jira: " + e.getMessage());
            }
        }

        return savedTask;
    }

    @PostMapping("/{id}/approve")
    public Task approveTask(@PathVariable("id") Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setAiDraft(false); // Move from "Decision Feed" to "Active Backlog"

        // Auto-export to Jira on approval for Hackathon demo
        try {
            String jiraKey = jiraService.createIssue(task);
            task.setJiraKey(jiraKey);
        } catch (Exception e) {
            System.err.println("Auto-export to Jira failed: " + e.getMessage());
        }

        return taskRepository.save(task);
    }

    @PostMapping("/{id}/export/jira")
    public Task exportToJira(@PathVariable("id") Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        String jiraKey = jiraService.createIssue(task);
        task.setJiraKey(jiraKey);
        return taskRepository.save(task);
    }

    @GetMapping("/jira-config")
    public java.util.Map<String, String> getJiraConfig() {
        java.util.Map<String, String> config = new java.util.HashMap<>();
        config.put("url", jiraService.getJiraUrl());
        config.put("projectKey", jiraService.getJiraProjectKey());
        return config;
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable("id") Long id) {
        taskRepository.deleteById(id);
    }
}
