import os

import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)


def stream_grounded_response(
    question: str,
    context: str,
):

    model = genai.GenerativeModel(
        "gemini-2.5-flash"
    )

    prompt = f"""
You are ContentCrew's Brand Brain.

Answer ONLY from the provided context.

If the answer does not exist,
say:

I could not find that information in the uploaded documents.

CONTEXT:
----------------
{context}
----------------

QUESTION:
{question}

ANSWER:
"""

    response = model.generate_content(
        prompt,
        stream=True,
    )

    for chunk in response:

        if chunk.text:
            yield chunk.text