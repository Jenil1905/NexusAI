# Nexus AI: The Autonomous Project Oracle 🌌

Nexus AI is a context-aware system built for **SpeedRun 2026**. It solves the "Documentation Debt" problem in remote engineering teams by bridging the gap between chaotic team chat (Slack/Discord) and structured project management (Jira/Linear).

## 🚀 The Core Vision
In modern startups, 30% of project management time is wasted manually updating tickets based on decisions made in chat. Nexus AI monitors your communication streams, extracts concrete decisions using LLMs, and drafts project updates autonomously.

## 🛠️ Tech Stack
- **Backend**: Java 17 + Spring Boot 3 + Spring Data JPA (PostgreSQL/H2)
- **AI Service**: Python 3.10 + FastAPI + LangChain + OpenAI GPT-4o
- **Frontend**: React 18 + TailwindCSS + Lucide Icons + Vite
- **Architecture**: Microservices connected via REST APIs

## 🏗️ System Components

### 1. Spring Boot Backend (`/backend`)
The source of truth for project state. 
- Manages Projects and Tasks.
- Exposes a standard REST API.
- Handles "Human-in-the-loop" approvals.

### 2. AI Extraction Engine (`/ai-service`)
The "Brain" of the system.
- Analyzes natural language transcripts.
- Performs Intent Detection to separate "Chat" from "Decisions".
- Resolves context and generates structured task metadata.

### 3. Oracle Dashboard (`/frontend`)
A premium, dark-mode React interface.
- **Decision Feed**: Real-time stream of AI-detected suggestions.
- **Project Board**: View and manage active backlog.
- **Chat Simulator**: A built-in tool for judges to test the AI pipeline instantly.

## 🏃 How to Run

### Prerequisite: Set `.env` in `/ai-service`
```env
OPENAI_API_KEY=your_key_here
```

### Step 1: Start Backend (Java)
```bash
cd backend
mvn spring-boot:run
```

### Step 2: Start AI Service (Python)
```bash
cd ai-service
# Create a virtual environment to avoid system package conflicts
python3 -m venv venv
# Activate the environment
source venv/bin/activate
# Install requirements
pip install -r requirements.txt
# Run the service
python main.py
```

### Step 3: Start Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## 👨‍💻 "Human-Like" Code Philosophy
This project was built focusing on maintainability and readability. 
- **Explicit Logic**: We avoided "magic" annotations where manual implementation provided more clarity (e.g., manual Getters/Setters in Java, long-form loops in Python).
- **Descriptive Naming**: Every variable and function name describes its purpose in the business logic, not just its technical role.

---
*Built for SpeedRun 2026 - From Zero to Day-1 Startup Infrastructure.*
