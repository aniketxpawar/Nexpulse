from langchain_google_genai import ChatGoogleGenerativeAI
from config import GEMINI_API_KEY

gemini_llm = ChatGoogleGenerativeAI(
    api_key=GEMINI_API_KEY,
    model="gemini-1.5-pro"
)
