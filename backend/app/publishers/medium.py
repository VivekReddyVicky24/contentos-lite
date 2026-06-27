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

        # TODO:
        # Integrate Medium API

        return {
            "platform": "medium",
            "status": "scheduled",
            "title": title,
        }