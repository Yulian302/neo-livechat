from pydantic import BaseModel, Field
from typing import Literal, List, Union
from datetime import datetime, timezone


# user-specific types

class MessageData(BaseModel):
    sender_id: int
    content: str


class ActiveUsersData(BaseModel):
    active_users: int


class HistoryMessageData(BaseModel):
    messages: List[MessageData]

# ws types


class UserMessage(BaseModel):
    type: Literal["user_message"]
    data: MessageData
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'))


class ActiveUsersMessage(BaseModel):
    type: Literal["active_users_update"]
    data: ActiveUsersData


class HistoryMessage(BaseModel):
    type: Literal["messages_history"]
    data: HistoryMessageData


MessageType = Union[UserMessage, ActiveUsersMessage, HistoryMessage]
