def readability_score(
    text: str,
):

    words = text.split()

    sentences = max(
        text.count("."),
        1,
    )

    avg_words = len(words) / sentences

    if avg_words <= 15:
        return 95

    if avg_words <= 20:
        return 85

    if avg_words <= 25:
        return 75

    return 60