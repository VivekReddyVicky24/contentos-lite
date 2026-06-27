from abc import ABC
from abc import abstractmethod


class BasePublisher(ABC):

    @abstractmethod
    def publish(
        self,
        title: str,
        content: str,
    ):
        pass