from app.publishers.base import (
    BasePublisher,
)


class GhostPublisher(
    BasePublisher
):

    def publish(
        self,
        title: str,
        content: str,
    ):

        return {
            "platform": "ghost",
            "status": "stub",
            "title": title,
        }