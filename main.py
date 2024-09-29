from fastapi import FastAPI, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from models.messaging_models import UserMessage, ActiveUsersMessage, ActiveUsersData, MessageData, HistoryMessageData, HistoryMessage
from typing import Deque
from collections import deque

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=[
                   "*"], allow_methods=["*"], allow_headers=["*"], allow_credentials=True)


# user_id -> user_ws
connected_users = dict()

messages: Deque[dict] = deque()


@app.get("/")
def say_hello(req: Request):
    return "hello"


def get_number_active_users():
    return len(connected_users)


async def broadcast_active_users():
    active_users_count = get_number_active_users()
    active_users_message = ActiveUsersMessage(type="active_users_update", data=ActiveUsersData(
        active_users=active_users_count)).model_dump()
    for user_ws in connected_users.values():
        try:
            await user_ws.send_json(active_users_message)
        except:
            continue


@app.websocket("/ws/{user_id}")
async def sample(user_id: int, ws: WebSocket):
    await ws.accept()

    # send previous messages
    await ws.send_json(HistoryMessage(type="messages_history", data=HistoryMessageData(messages=list(messages))).model_dump())

    connected_users[user_id] = ws
    await broadcast_active_users()

    try:
        while True:
            try:
                data = await ws.receive_json()
                message_data = UserMessage.model_validate(data)
                messages.append(message_data.model_dump())

                if len(messages) > 40:
                    messages.popleft()

                print(len(messages))
                print(f"User: {user_id}, Msg: {message_data.data.content}")

                for user, user_ws in connected_users.items():
                    if user_id != user:
                        msg = UserMessage(type="user_message", data=MessageData(
                            sender_id=user_id, content=message_data.data.content)).model_dump()

                        try:
                            await user_ws.send_json(msg)
                        except Exception as e:
                            print(f"Error sending message to user {user}: {e}")
                            continue

            except Exception as e:
                print(f"Error with user {user_id}: {e}")
                break
    finally:
        if user_id in connected_users:
            del connected_users[user_id]
        await broadcast_active_users()
        await ws.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
