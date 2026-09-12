from app.services.strategy_service import (
    generate_strategy,
)


def strategist_node(state):

    workspace_id = (
        state.get(
            "workspace_id"
        )
    )

    strategy = generate_strategy(
        workspace_id
    )

    logs = state.get(
        "execution_log",
        []
    )

    logs.append(
        "strategist: completed"
    )

    return {
        "strategy": strategy,
        "current_agent":
            "strategist",
        "execution_log":
            logs,
    }