import os
import requests
import json
import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Standard LangChain imports
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_classic.output_parsers import ResponseSchema, StructuredOutputParser

# Slack Bolt imports
from slack_bolt import App
from slack_bolt.adapter.fastapi import SlackRequestHandler

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="Nexus AI - Decision Extraction Engine")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "Nexus AI Engine is Active", "slack_connected": os.getenv("SLACK_BOT_TOKEN") is not None}

# Initialize Slack App
slack_app = App(
    token=os.getenv("SLACK_BOT_TOKEN"),
    signing_secret=os.getenv("SIGNING_SECRET")
)
handler = SlackRequestHandler(slack_app)

# Buffer to store messages per channel (In-memory for Hackathon)
channel_buffers: dict[str, list[str]] = {}

# Global variable for bot ID to avoid repeated API calls
BOT_USER_ID = None

# URL of our Spring Boot backend
BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8080/api")

class ChatInput(BaseModel):
    messages: list[str]
    project_id: int

class AskInput(BaseModel):
    question: str
    context: list[str]

# Define the schema for our AI extraction
decisions_schema = ResponseSchema(
    name="decisions", 
    description="List of detected decisions. Each decision must include: 'title' (AI Insight: ...), 'content' (Detailed description), 'author' (Person), 'deadline' (Date/Undated), 'decision_state' (AGREED, REJECTED, CONTESTED), and 'context' (The chat snippet)."
)

output_parser = StructuredOutputParser.from_response_schemas([decisions_schema])

prompt_template = ChatPromptTemplate.from_template("""
You are Nexus AI, an autonomous Project Decision Detection system.

Your job is to detect whether a conversation CAUSED a project change or reached a conclusion.

IDENTIFY ALL INDEPENDENT PROJECT DECISIONS.
Each decision must represent a separate actionable task.

A decision exists if these conditions are met:
1. ACTION PROPOSAL: A concrete action is suggested (create, fix, update, etc.)
2. AUTHORITY SIGNAL: A team member or authority figure responds.

EXTRACTION HINTS:
- CONTENT: Provide a DETAILED description of what was decided. Explain 'what', 'why', and 'how'.
- AUTHOR: Identify the specific person proposing or making the decision.
- DEADLINE: Look for dates or relative times. If none, return "Undated".

DECISION STATES:
- AGREED: Proposal has consensus.
- REJECTED: Proposal was explicitly denied.
- CONTESTED: Ongoing disagreement.

OUTPUT RULES:
- Return a list of decisions under the 'decisions' key.
- Titles must start with "AI Insight:".
- Descriptions (content) must be at least 2 sentences.

CHAT TRANSCRIPT:
{transcript}

{format_instructions}
""")

ask_prompt_template = ChatPromptTemplate.from_template("""
You are Nexus AI, an intelligent project oracle.

Answer the user's question accurately and concisely based ONLY on the provided project context.
If the answer is not contained in the context, say "I don't have enough information in the current project context to answer that."

PROJECT CONTEXT (Recent Tasks and Decisions):
{context}

USER QUESTION:
{question}
""")

def get_bot_user_id():
    global BOT_USER_ID
    if not BOT_USER_ID:
        try:
            auth_response = slack_app.client.auth_test()
            BOT_USER_ID = auth_response["user_id"]
            print(f"DEBUG: Bot User ID is {BOT_USER_ID}")
        except Exception as e:
            print(f"Error fetching bot user id: {e}")
    return BOT_USER_ID

@slack_app.event("message")
def handle_message_events(event, say):
    """
    Buffer messages and detect mentions within channel messages.
    """
    channel = event.get("channel")
    text = event.get("text", "")
    user = event.get("user")
    bot_id = event.get("bot_id")
    
    if bot_id:
        return

    print(f"DEBUG: Message in {channel}: '{text[:30]}...'")

    if channel not in channel_buffers:
        channel_buffers[channel] = []
    
    # Check if the bot is mentioned
    bot_user_id = get_bot_user_id()
    mention_str = f"<@{bot_user_id}>" if bot_user_id else ""
        
    is_keyword_trigger = "extract" in text.lower()
    is_mention = (bot_user_id and mention_str in text)
    
    if is_mention or is_keyword_trigger:
        print(f"DEBUG: Triggering analysis for {channel} (mention={is_mention}, keyword={is_keyword_trigger})")
        trigger_analysis(channel, say)
    else:
        buffer = channel_buffers.get(channel)
        if isinstance(buffer, list):
            buffer.append(f"User {user}: {text}")
            if len(buffer) > 20:
                buffer.pop(0)
            print(f"DEBUG: Internal Buffer Size for {channel}: {len(buffer)}")

@slack_app.event("app_mention")
def handle_mentions_event(event, say):
    """
    Trigger AI analysis when the bot is explicitly mentioned via event.
    """
    channel = event.get("channel")
    print(f"DEBUG: Bot Mentioned (dedicated event) in {channel}")
    trigger_analysis(channel, say)

def trigger_analysis(channel, say):
    """
    Common logic to trigger AI extraction.
    """
    buffer = channel_buffers.get(channel, [])
    if not buffer:
        say("🌌 I haven't captured any conversation context in this channel yet!")
        return

    say(f"🌌 *Context captured ({len(buffer)} messages).* Analyzing for project decisions...")
    
    try:
        input_data = ChatInput.model_validate({
            "messages": buffer,
            "project_id": 1
        })
        
        result = run_extraction_sync(input_data)
        
        if result.get("status") == "success":
            count = result.get("tasks_created", 0)
            say(f"✅ *Analysis Complete!* Found and drafted **{count}** tasks in the Nexus Dashboard.")
        elif result.get("status") == "simulated":
            say("🛠️ *Simulation Mode:* AI Key missing, but I created a sample task!")
        else:
            say("I analyzed the chat but didn't find any clear project decisions yet. Keep talking!")
    except Exception as e:
        print(f"Extraction Trigger Error: {e}")
        say("Sorry, I encountered an error while analyzing the chat. Check server logs.")

@app.post("/slack/events")
async def slack_events(request: Request):
    """
    Endpoint for Slack Events API.
    """
    if "x-slack-retry-num" in request.headers:
        print(f"DEBUG: Ignoring Slack retry #{request.headers['x-slack-retry-num']} to prevent duplicate extraction!")
        return {"status": "ignored"}
        
    return await handler.handle(request)

@app.post("/process-chat")
async def process_chat_endpoint(input_data: ChatInput):
    """
    Manual API endpoint to trigger extraction.
    """
    return run_extraction_sync(input_data)

@app.post("/ask")
async def ask_endpoint(input_data: AskInput):
    """
    Endpoint to answer questions based on project context.
    """
    api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
    if not api_key or len(api_key) < 10:
        return {"answer": "Simulation Mode: I would answer your question based on the context here, but my AI key is missing!"}
    
    try:
        llm = ChatOpenAI(
            base_url="https://openrouter.ai/api/v1",
            model="google/gemini-2.0-flash-001",
            api_key=api_key
        )
        chain = ask_prompt_template | llm
        
        context_str = "\n---\n".join(input_data.context)
        response = chain.invoke({
            "context": context_str,
            "question": input_data.question
        })
        
        return {"answer": response.content}
    except Exception as e:
        print(f"Ask extraction error: {e}")
        return {"answer": "Sorry, I encountered an error while trying to answer your question."}

def run_extraction_sync(input_data: ChatInput):
    """
    Core extraction logic shared by Slack and Manual API.
    """
    if not input_data.messages:
        return {"status": "no_messages"}

    full_transcript = "\n".join(input_data.messages)
    api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
    
    print(f"DEBUG: Starting extraction for project {input_data.project_id}")
    
    if not api_key or len(api_key) < 10:
        return simulate_extraction(full_transcript, input_data.project_id)

    try:
        llm = ChatOpenAI(
            base_url="https://openrouter.ai/api/v1",
            model="google/gemini-2.0-flash-001",
            api_key=api_key
        )
        format_instructions = output_parser.get_format_instructions()
        chain = prompt_template | llm | output_parser

        parsed_output = chain.invoke({
            "transcript": full_transcript,
            "format_instructions": format_instructions
        })
        
        decisions = parsed_output.get("decisions", [])
        if not decisions:
            return {"status": "no_decision_found"}
        
        print(f"DEBUG: Found {len(decisions)} potential decisions.")
        processed_count = 0
        for i, decision in enumerate(decisions):
            print(f"DEBUG: Processing decision {i+1}/{len(decisions)}: {decision.get('title')}")
            success = send_to_backend(
                title=str(decision.get("title", "AI Task")),
                content=str(decision.get("content", "No description.")),
                project_id=int(input_data.project_id),
                author=str(decision.get("author", "Slack User")),
                deadline=str(decision.get("deadline", "Undated")),
                context=str(decision.get("context", full_transcript)),
                decision_state=str(decision.get("decision_state", "AGREED"))
            )
            if success:
                processed_count += 1
        
        print(f"DEBUG: Successfully created {processed_count} tasks in backend.")
        return {
            "status": "success", 
            "tasks_created": processed_count, 
            "total_found": len(decisions)
        }
    except Exception as e:
        print(f"AI Extraction Error: {e}")
        return simulate_extraction(full_transcript, input_data.project_id)

def send_to_backend(title, content, project_id, author="AI Agent", deadline="TBD", context="", decision_state="AGREED"):
    payload = {
        "title": title,
        "content": content,
        "status": "OPEN",
        "author": author,
        "deadline": deadline,
        "context": context,
        "aiDraft": True,
        "isAiDraft": True,
        "decisionState": decision_state,
        "project": {"id": project_id}
    }
    try:
        print(f"DEBUG: Sending to backend: {BACKEND_URL}/tasks")
        response = requests.post(f"{BACKEND_URL}/tasks", json=payload, timeout=5)
        if response.status_code >= 400:
            print(f"❌ Backend Error ({response.status_code}): {response.text}")
        response.raise_for_status()
        print(f"✅ Successfully sent {decision_state} task to backend: {title}")
        return True
    except Exception as e:
        print(f"❌ Backend POST Error: {e}")
        return False

def simulate_extraction(transcript, project_id):
    if len(transcript) > 10:
        success = send_to_backend(
            "AI Insight: Simulated Task",
            f"Extracted context: {transcript[:100]}",
            project_id,
            author="Slack System",
            decision_state="AGREED"
        )
        return {"status": "simulated", "tasks_created": 1 if success else 0}
    return {"status": "no_decision_found"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
