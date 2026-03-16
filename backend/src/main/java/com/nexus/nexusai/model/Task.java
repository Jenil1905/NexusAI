package com.nexus.nexusai.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String content;

    @Column(nullable = false)
    private String status; // OPEN, IN_PROGRESS, DONE

    @Column
    private String author;

    @Column
    private String deadline;

    @Column(length = 4000)
    private String context;

    @JsonProperty("aiDraft")
    @Column(name = "is_ai_draft")
    private Boolean isAiDraft = true; // Default to true for AI-generated tasks

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "decision_state")
    private String decisionState = "AGREED"; // AGREED, CONTESTED, REJECTED

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "jira_key")
    private String jiraKey;

    public Task() {
        this.createdAt = LocalDateTime.now();
    }

    // Manual Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @JsonProperty("aiDraft")
    public Boolean isAiDraft() {
        return isAiDraft;
    }

    @JsonProperty("aiDraft")
    public void setAiDraft(Boolean aiDraft) {
        this.isAiDraft = aiDraft;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public String getDecisionState() {
        return decisionState;
    }

    public void setDecisionState(String decisionState) {
        this.decisionState = decisionState;
    }

    public String getJiraKey() {
        return jiraKey;
    }

    public void setJiraKey(String jiraKey) {
        this.jiraKey = jiraKey;
    }
}
