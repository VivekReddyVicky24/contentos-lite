def brand_alignment_score(
    text: str,
    brand_profile: dict,
):

    voice = brand_profile.get(
        "brand_voice",
        "",
    ).lower()

    if not voice:
        return 100

    matches = 0

    for word in voice.split():

        if word in text.lower():
            matches += 1

    return min(
        100,
        matches * 20,
    )