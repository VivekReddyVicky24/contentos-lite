def groundedness_score(
    text: str,
    research: str,
):

    research_words = set(
        research.lower().split()
    )

    draft_words = set(
        text.lower().split()
    )

    if not research_words:
        return 0

    overlap = len(
        research_words &
        draft_words
    )

    return int(
        overlap
        / len(research_words)
        * 100
    )