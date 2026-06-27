ALLOWED_PLATFORMS = {

    "linkedin",

    "twitter",

    "x",

    "blog",

    "youtube",

    "instagram",

    "facebook",

    "medium",
}


def validate_platforms(
    platforms: list[str],
):

    return all(
        platform.lower()
        in ALLOWED_PLATFORMS
        for platform in platforms
    )