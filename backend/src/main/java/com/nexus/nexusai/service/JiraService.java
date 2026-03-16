package com.nexus.nexusai.service;

import com.nexus.nexusai.model.Task;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class JiraService {

    @Value("${jira.url:https://your-domain.atlassian.net}")
    private String jiraUrl;

    @Value("${jira.email:}")
    private String jiraEmail;

    @Value("${jira.api-token:}")
    private String jiraApiToken;

    @Value("${jira.project-key:NEX}")
    private String jiraProjectKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getJiraUrl() {
        return jiraUrl;
    }

    public String getJiraProjectKey() {
        return jiraProjectKey;
    }

    public String createIssue(Task task) {
        // Fallback for demo if credentials are not set
        if (jiraEmail == null || jiraEmail.isEmpty() || jiraApiToken == null || jiraApiToken.isEmpty()) {
            System.out.println("Jira credentials missing, using mock response.");
            return "NEX-" + (100 + (int) (Math.random() * 900));
        }

        String url = jiraUrl + "/rest/api/3/issue";

        // Construct Issue Payload
        Map<String, Object> fields = new HashMap<>();
        fields.put("summary", task.getTitle());

        Map<String, String> project = new HashMap<>();
        project.put("key", jiraProjectKey); // Dynamic Project Key from properties
        fields.put("project", project);

        Map<String, String> issuetype = new HashMap<>();
        issuetype.put("name", "Task");
        fields.put("issuetype", issuetype);

        // Atlassian Document Format (ADF) for Description
        Map<String, Object> description = new HashMap<>();
        description.put("type", "doc");
        description.put("version", 1);

        Map<String, Object> contentNode = new HashMap<>();
        contentNode.put("type", "paragraph");

        Map<String, String> textNode = new HashMap<>();
        textNode.put("type", "text");
        textNode.put("text", task.getContent() != null ? task.getContent() : "No description provided.");

        contentNode.put("content", new Object[] { textNode });
        description.put("content", new Object[] { contentNode });
        fields.put("description", description);

        Map<String, Object> payload = new HashMap<>();
        payload.put("fields", fields);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth(jiraEmail, jiraApiToken);

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(url, HttpMethod.POST, entity,
                    (Class<Map<String, Object>>) (Class<?>) Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                return body.get("key").toString();
            }
        } catch (Exception e) {
            System.err.println("Jira Export Error: " + e.getMessage());
        }

        return "ERROR-JIRA";
    }

    public void updateIssueStatus(String jiraKey, String status) {
        if (jiraKey == null || jiraKey.isEmpty() || jiraKey.contains("ERROR") || jiraKey.contains("MOCK")) {
            return;
        }

        // Map Nexus status to Jira Transition Name
        String targetTransitionName = null;
        if ("IN_PROGRESS".equalsIgnoreCase(status)) {
            targetTransitionName = "In Progress";
        } else if ("DONE".equalsIgnoreCase(status)) {
            targetTransitionName = "Done";
        }

        if (targetTransitionName == null)
            return;

        String transitionsUrl = jiraUrl + "/rest/api/3/issue/" + jiraKey + "/transitions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth(jiraEmail, jiraApiToken);

        try {
            // 1. Get available transitions
            HttpEntity<Void> getEntity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(transitionsUrl, HttpMethod.GET, getEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                java.util.List<Map<String, Object>> transitions = (java.util.List<Map<String, Object>>) response
                        .getBody().get("transitions");
                String transitionId = null;

                for (Map<String, Object> t : transitions) {
                    if (targetTransitionName.equalsIgnoreCase((String) t.get("name"))) {
                        transitionId = (String) t.get("id");
                        break;
                    }
                }

                if (transitionId != null) {
                    // 2. Perform the transition
                    Map<String, Object> transitionObj = new HashMap<>();
                    transitionObj.put("id", transitionId);

                    Map<String, Object> payload = new HashMap<>();
                    payload.put("transition", transitionObj);

                    HttpEntity<Map<String, Object>> postEntity = new HttpEntity<>(payload, headers);
                    restTemplate.postForEntity(transitionsUrl, postEntity, Void.class);
                    System.out.println("Jira status updated for " + jiraKey + " to " + targetTransitionName);
                }
            }
        } catch (Exception e) {
            System.err.println("Jira Status Update Error: " + e.getMessage());
        }
    }
}
