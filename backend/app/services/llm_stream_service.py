import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)


def stream_grounded_response(
    question: str,
    context: str,
):

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

    response = client.models.generate_content_stream(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    for chunk in response:

        if chunk.text:
            yield chunk.text
