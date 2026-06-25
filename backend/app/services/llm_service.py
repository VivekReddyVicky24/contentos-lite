import os

import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_grounded_response(
    question: str,
    context: str,
):
    model = genai.GenerativeModel(
        "gemini-2.5-flash"
    )

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

    response = model.generate_content(
        prompt
    )

    return response.text