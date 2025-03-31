from langchain.chat_models import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langchain.agents import AgentExecutor, initialize_agent
from langchain.agents import Tool
from tools import TOOLS
from llm_setup import gemini_llm
from pydantic import BaseModel


class BotState(BaseModel):
    user_input: str
    response: str = None
    next_step: str = "chatbot_reply"  # ✅ Ensure next_step always has a default
  # Default None to avoid validation errors

# Define Nodes (Processing Steps)
def decide_tool(state: BotState):
    """Decides which tool to use based on user query."""
    query = state.user_input.lower()

    if "appointment" in query:
        return {"next_step": "get_upcoming_appointments"}
    elif "doctor" in query:
        return {"next_step": "get_doctor_info"}
    elif "precaution" in query or "safety" in query:
        return {"next_step": "get_precautions"}
    else:
        return {"next_step": "chatbot_reply"}

def chatbot_reply(state: BotState):
    """Nexpulse AI - Your Virtual Healthcare Assistant"""

    prompt = f"""
    You are **Nexpulse AI**, an intelligent virtual healthcare assistant for an **online medical consultation platform**.  
    Your role is to assist users by:
    - **Understanding symptoms** and providing possible explanations.
    - **Guiding users** on the next steps, including whether they should consult a doctor.
    - **Providing general health tips** and answering medical queries.
    - **Helping users find the right specialist** based on their symptoms or concerns.

    **Guidelines for response:**
    - Be empathetic and professional.
    - **Do NOT provide a definitive diagnosis**—instead, guide users to seek medical attention if necessary.
    - If symptoms are severe, advise users to contact emergency services.
    - Ensure clarity and simplicity in explanations.

    **User Query:** {state.user_input}

    **Your Response:** (Provide a medically appropriate, well-structured response)
    """

    response = gemini_llm.invoke(prompt)
    return BotState(user_input=state.user_input, response=str(response.content))


# Initialize LangGraph
workflow = StateGraph(BotState)

# Add Nodes
workflow.add_node("decide_tool", decide_tool)
workflow.add_node("chatbot_reply", chatbot_reply)
workflow.add_node("chatbot_reply", chatbot_reply)
for tool in TOOLS:
    workflow.add_node(tool.name, tool)

# Add Edges
workflow.add_edge(START, "decide_tool")

# Use Conditional Edges for Dynamic Routing
workflow.add_conditional_edges(
    "decide_tool",
    lambda state: state.next_step,  # ✅ FIX: Use dot notation
    {
        "get_upcoming_appointments": "get_upcoming_appointments",
        "get_doctor_info": "get_doctor_info",
        "get_precautions": "get_precautions",
        "chatbot_reply": "chatbot_reply",
    }
)


# Connect End Nodes
workflow.add_edge("get_upcoming_appointments", END)
workflow.add_edge("get_doctor_info", END)
workflow.add_edge("get_precautions", END)
workflow.add_edge("chatbot_reply", END)

# Set Start Node
workflow.set_entry_point("decide_tool")

# Compile Workflow
final_workflow = workflow.compile()
