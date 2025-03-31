from langchain.tools import tool

@tool
def get_upcoming_appointments(user_query: dict):
    """Fetch upcoming appointments based on user input"""
    # Ensure input is a dictionary
    if not isinstance(user_query, dict):
        user_query = {"query": user_query}  # Convert to expected format

    # Your logic to retrieve appointments
    return {"appointments": ["Dr. Smith - March 31, 2025", "Dr. Johnson - April 5, 2025"]}

@tool
def get_doctor_info(specialty: str):
    """
    Finds doctors based on specialty.
    """
    doctors = {
        "cardiologist": ["Dr. Alex", "Dr. Kim"],
        "dermatologist": ["Dr. Lisa", "Dr. Ray"],
    }
    return doctors.get(specialty.lower(), "No doctors found for this specialty.")

@tool
def get_precautions(illness: str):
    """
    Provides precautions based on illness.
    """
    precautions = {
        "cold": "Stay hydrated, get plenty of rest, and take vitamin C.",
        "fever": "Monitor temperature, stay cool, and drink fluids.",
    }
    return precautions.get(illness.lower(), "Please consult a doctor for proper advice.")

TOOLS = [get_upcoming_appointments, get_doctor_info, get_precautions]
