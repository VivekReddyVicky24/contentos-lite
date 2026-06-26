import json
import os

from dotenv import load_dotenv

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
)

from app.agents.prompts.seo_prompt import (
    SEO_PROMPT,
)

load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-lite",
    google_api_key=os.getenv(
        "GEMINI_API_KEY"
    ),
)


def seo_node(state):

    prompt = SEO_PROMPT.format(
        topic=state["topic"],
        research=state["research"],
        plan=json.dumps(
            state["plan"],
            indent=2,
        ),
    )

    response = llm.invoke(prompt)

    try:

        cleaned = (
            response.content
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        seo = json.loads(cleaned)

    except Exception as e:

        print("SEO ERROR:", e)

        print(response.content)

        seo = {
            "primary_keyword": "",
            "secondary_keywords": [],
            "search_intent": "",
            "meta_title": "",
            "meta_description": "",
            "internal_link_ideas": [],
        }
    logs = state.get(
        "execution_log",
        []
    )

    logs.append(
        "seo: completed"
    )    

    return {
    "seo": seo,

    "current_agent":
        "seo",

    "execution_log":
        logs,
    }
