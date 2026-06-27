from app.publishers.base import (
    BasePublisher,
)


class WordPressPublisher(
    BasePublisher
):

    def publish(
        self,
        title: str,
        content: str,
    ):

        # TODO:
        # Integrate WordPress XML-RPC

        return {
            "platform": "wordpress",
            "status": "scheduled",
            "title": title,
        }