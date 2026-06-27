from collections import defaultdict
from datetime import datetime, timedelta


REQUESTS = defaultdict(list)

MAX_REQUESTS = 20

WINDOW_MINUTES = 1


def check_rate_limit(
    workspace_id: str,
):

    now = datetime.utcnow()

    REQUESTS[workspace_id] = [
        ts
        for ts in REQUESTS[workspace_id]
        if now - ts
        < timedelta(
            minutes=WINDOW_MINUTES
        )
    ]

    if len(
        REQUESTS[workspace_id]
    ) >= MAX_REQUESTS:
        return False

    REQUESTS[
        workspace_id
    ].append(now)

    return True