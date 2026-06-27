def calculate_average(
    values: list[int],
):

    if not values:
        return 0

    return int(
        sum(values)
        / len(values)
    )