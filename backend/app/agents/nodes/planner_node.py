import json
import os

from dotenv import load_dotenv

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
)

from app.agents.prompts.planner_prompt import (
    PLANNER_PROMPT,
)

load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv(
        "GEMINI_API_KEY"
    ),
)


def planner_node(state):

    prompt = PLANNER_PROMPT.format(
        research=state["research"]
    )

    response = llm.invoke(prompt)

    try:

        cleaned = (
            response.content
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        plan = json.loads(cleaned)

    except Exception as e:

        print("PLANNER ERROR:", e)
        print("RAW RESPONSE:")
        print(response.content)

        plan = {
            "target_audience": [],
            "content_angles": [],
            "blog_titles": [],
            "content_goal":
                "Could not generate plan",
        }

    return {
        "plan": plan
    }