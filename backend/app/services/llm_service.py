import os
import time

from google import genai
from google.genai import errors

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=API_KEY
)

PRIMARY_MODEL = "gemini-2.5-flash"
FALLBACK_MODEL = "gemini-3.5-flash-lite"


def generate_text(
    prompt: str,
) -> str:

    models = [
        PRIMARY_MODEL,
        FALLBACK_MODEL,
    ]

    last_error = None

    for model in models:

        for attempt in range(3):

            try:

                print(
                    f"LLM request: model={model}, "
                    f"attempt={attempt + 1}"
                )

                response = (
                    client.models.generate_content(
                        model=model,
                        contents=prompt,
                    )
                )

                if not response.text:
                    raise RuntimeError(
                        f"Empty response from {model}"
                    )

                print(
                    f"LLM success: model={model}"
                )

                return response.text

            except errors.ServerError as e:

                last_error = e

                print(
                    f"LLM server error "
                    f"(model={model}, "
                    f"attempt={attempt + 1}): {e}"
                )

                # Retry transient 5xx errors
                if attempt < 2:

                    delay = 2 ** attempt

                    print(
                        f"Retrying in {delay} seconds..."
                    )

                    time.sleep(delay)

                else:

                    print(
                        f"Model {model} failed "
                        f"after 3 attempts."
                    )

            except Exception as e:

                last_error = e

                print(
                    f"LLM error "
                    f"(model={model}): {e}"
                )

                break

    raise last_error
