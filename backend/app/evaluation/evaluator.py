from app.evaluation.brand_alignment import (
    brand_alignment_score,
)

from app.evaluation.groundedness import (
    groundedness_score,
)

from app.evaluation.readability import (
    readability_score,
)

from app.evaluation.aggregate import (
    aggregate_scores,
)


def evaluate_content(
    edited_draft,
    research,
    brand_profile,
):
    text = str(edited_draft)

    evaluation = {
        "readability": readability_score(
            text
        ),
        "brand_alignment": brand_alignment_score(
            text,
            brand_profile,
        ),
        "groundedness": groundedness_score(
            text,
            research,
        ),
    }

    return aggregate_scores(
        evaluation
    )