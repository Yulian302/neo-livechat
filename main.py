from fastapi import FastAPI, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=[
                   "*"], allow_methods=["*"], allow_headers=["*"], allow_credentials=True)


# user_id -> user_ws
connected_users = dict()


@app.get("/")
def say_hello(req: Request):
    return "hello"


@app.websocket("/ws/{user_id}")
async def sample(user_id: int, ws: WebSocket):
    await ws.accept()
    connected_users[user_id] = ws
    try:
        while True:
            data = await ws.receive_text()
            for user, user_ws in connected_users.items():
                if user_id != user:
                    await user_ws.send_text(data)

    except:
        del connected_users[user_id]
        await ws.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
