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

        # TODO:
        # Integrate Ghost Admin API

        return {
            "platform": "ghost",
            "status": "scheduled",
            "title": title,
        }