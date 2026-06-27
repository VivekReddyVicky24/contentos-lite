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

        return {
            "platform": "wordpress",
            "status": "stub",
            "title": title,
        }