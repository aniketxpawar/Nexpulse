from workflow import final_workflow

def run_bot():
    print("Welcome to Nexpulse AI Assistant!")
    while True:
        query = input("You: ")
        if query.lower() in ["exit", "quit"]:
            print("Goodbye!")
            break
        
        state = {"user_input": query, "response": ""}
        response = final_workflow.invoke(state)
        print("Bot:", response['response'])

if __name__ == "__main__":
    run_bot()
