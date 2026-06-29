import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)


def generate_text(
    prompt: str,
) -> str:

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return response.text or ""


def generate_grounded_response(
    question: str,
    context: str,
) -> str:
    prompt = f"""
You are ContentCrew's Brand Brain.

Answer ONLY using the provided context.

If the answer is not present, say:

"I could not find that information in the uploaded documents."

Be concise and factual.

CONTEXT:
-------------------
{context}
-------------------

QUESTION:
{question}

ANSWER:
"""

    return generate_text(prompt)
