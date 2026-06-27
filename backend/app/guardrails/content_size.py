MAX_INPUT_LENGTH = 5000


def validate_content_size(
    text: str,
):

    return len(text) <= MAX_INPUT_LENGTH