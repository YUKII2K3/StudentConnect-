from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import asyncio
import motor.motor_asyncio
import json

app = FastAPI()

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- WebSocket Connection Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

notification_manager = ConnectionManager()

# --- WebSocket Connection Manager for Chat Rooms ---
class ChatManager:
    def __init__(self):
        # Maps group_id to a list of active connections
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, group_id: str):
        await websocket.accept()
        if group_id not in self.active_connections:
            self.active_connections[group_id] = []
        self.active_connections[group_id].append(websocket)

    def disconnect(self, websocket: WebSocket, group_id: str):
        if group_id in self.active_connections:
            self.active_connections[group_id].remove(websocket)
            # Clean up the room if it's empty
            if not self.active_connections[group_id]:
                del self.active_connections[group_id]

    async def broadcast_to_group(self, message: str, group_id: str):
        if group_id in self.active_connections:
            for connection in self.active_connections[group_id]:
                await connection.send_text(message)

chat_manager = ChatManager()

# MongoDB setup
MONGO_URL = "mongodb://localhost:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client["studentconnect"]
messages_collection = db["messages"]

class Message(BaseModel):
    group_id: str
    user: str
    text: str
    timestamp: datetime

# --- WebSocket Endpoint for Notifications ---
@app.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket):
    await notification_manager.connect(websocket)
    try:
        while True:
            # Keep the connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        notification_manager.disconnect(websocket)

# --- WebSocket Endpoint for Group Chat ---
@app.websocket("/ws/chat/{group_id}")
async def chat_endpoint(websocket: WebSocket, group_id: str):
    await chat_manager.connect(websocket, group_id)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received message in group '{group_id}': {data}")
            # Parse and store the message
            msg = json.loads(data)
            msg_doc = {
                "group_id": group_id,
                "user": msg["user"],
                "text": msg["text"],
                "timestamp": datetime.utcnow()
            }
            await messages_collection.insert_one(msg_doc)
            # Broadcast to group (include timestamp for all clients)
            msg_doc["timestamp"] = msg_doc["timestamp"].isoformat()
            await chat_manager.broadcast_to_group(json.dumps(msg_doc), group_id)
    except WebSocketDisconnect:
        chat_manager.disconnect(websocket, group_id)


# --- Pydantic Model for the Test Message ---
class Notification(BaseModel):
    message: str

# --- Temporary Test Endpoint ---
@app.post("/send-notification")
async def send_notification(notification: Notification):
    """
    Accepts a message and broadcasts it to all connected WebSocket clients.
    """
    await notification_manager.broadcast(notification.message)
    return {"status": "Notification sent", "message": notification.message}

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/groups/{group_id}/messages", response_model=List[Message])
async def get_group_messages(group_id: str):
    cursor = messages_collection.find({"group_id": group_id}).sort("timestamp", 1)
    messages = []
    async for doc in cursor:
        doc["timestamp"] = doc["timestamp"].isoformat() if hasattr(doc["timestamp"], "isoformat") else doc["timestamp"]
        messages.append(Message(**doc))
    return messages
