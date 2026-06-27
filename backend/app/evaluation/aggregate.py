def aggregate_scores(
    evaluation: dict,
):

    scores = [
        evaluation.get(
            "readability",
            0,
        ),
        evaluation.get(
            "brand_alignment",
            0,
        ),
        evaluation.get(
            "groundedness",
            0,
        ),
    ]

    overall = int(
        sum(scores)
        / len(scores)
    )

    return {
        **evaluation,
        "overall_score":
            overall,
    }