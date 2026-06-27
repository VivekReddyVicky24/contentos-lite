from app.publishers.base import (
    BasePublisher,
)


class MediumPublisher(
    BasePublisher
):

    def publish(
        self,
        title: str,
        content: str,
    ):

        return {
            "platform": "medium",
            "status": "stub",
            "title": title,
        }