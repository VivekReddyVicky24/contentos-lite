import os

from dotenv import load_dotenv


load_dotenv()


REQUIRED_ENV_VARS = [
    "SUPABASE_URL",
    "GEMINI_API_KEY",
]

SUPABASE_KEY_ENV_VARS = [
    "SUPABASE_KEY",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
]


def validate_environment():
    missing = [
        var
        for var in REQUIRED_ENV_VARS
        if not os.getenv(var)
    ]

    if not any(
        os.getenv(var)
        for var in SUPABASE_KEY_ENV_VARS
    ):
        missing.append(
            "SUPABASE_KEY or SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY"
        )

    if missing:
        raise RuntimeError(
            f"Missing environment variables: {missing}"
        )
