def approval_router(
    state,
):

    if (
        state["approval_status"]
        == "approved"
    ):
        return "publish"

    return "end"