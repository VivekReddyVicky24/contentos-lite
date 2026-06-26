import os

from dotenv import load_dotenv

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
)

from app.agents.prompts.research_prompt import (
    RESEARCH_PROMPT,
)

load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-lite",
    google_api_key=os.getenv(
        "GEMINI_API_KEY"
    ),
)


def research_node(
    state,
):
    prompt = RESEARCH_PROMPT.format(
        topic=state["topic"]
    )

    response = llm.invoke(
        prompt
    )

    return {
    "research": response.content,

    "current_agent":
        "research",

    "execution_log":
        ["research: completed"],
}
