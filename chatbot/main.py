from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load env variables
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY is missing!")

# Configure Gemini
genai.configure(api_key=API_KEY)

# Create a single Gemini model instance
model = genai.GenerativeModel("models/gemini-1.5-pro-latest")  # ✅ Available in your list

# FastAPI app
app = FastAPI()

# Optional: CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Message schema
class Message(BaseModel):
    role: str  # "user" or "model"
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    reply: str

# System prompt
SYSTEM_PROMPT = """You are a helpful and responsible health assistant.

Your role is to help users understand their *health-related symptoms* and guide them to take safe steps. 
You may ask follow-up questions and offer general information about health issues, but you must *never*:
•⁠  ⁠Suggest or name any prescription medication.
•⁠  ⁠Diagnose any condition.
•⁠  ⁠Offer any emergency advice.

🚫 If the user's message is not related to health, you must politely respond with:
"I'm here to help with health-related questions only. Please ask something related to your health."

Always recommend that users consult a licensed medical professional for serious symptoms.
"""

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    # Combine system prompt + chat history
    history = [f"{msg.role}: {msg.content}" for msg in req.messages]
    prompt = f"{SYSTEM_PROMPT}\n\n" + "\n".join(history)

    # Send to Gemini
    response = model.generate_content(prompt)
    return ChatResponse(reply=response.text.strip())