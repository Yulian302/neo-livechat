from pydantic import BaseModel, Field
from typing import Literal, Union, List
from datetime import datetime, timezone


# user-specific types

class MessageData(BaseModel):
    sender_id: int
    content: str
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'))


class ActiveUsersData(BaseModel):
    active_users: int


# ws types


class UserMessage(BaseModel):
    type: Literal["user_message"]
    data: MessageData


class ActiveUsersMessage(BaseModel):
    type: Literal["active_users_update"]
    data: ActiveUsersData


class HistoryMessageData(BaseModel):
    messages: List[UserMessage]


class HistoryMessage(BaseModel):
    type: Literal["messages_history"]
    data: HistoryMessageData


MessageType = Union[UserMessage, ActiveUsersMessage, HistoryMessage]
