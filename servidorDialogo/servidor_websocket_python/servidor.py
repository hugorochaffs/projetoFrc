import asyncio
import json
import websockets

class ChatServer:
    def __init__(self):
        self.channels = {}

    async def handle_message(self, channel, websocket, message):
        for client in self.channels[channel]:
            if client != websocket:
                await client.send(message)

    async def handle_consumer(self, websocket, path):
        # Path deve ser algo como "/canal1" ou "/canal2"
        channel = path[1:]

        if channel not in self.channels:
            self.channels[channel] = set()

        self.channels[channel].add(websocket)

        try:
            async for message in websocket:
                await self.handle_message(channel, websocket, message)
        finally:
            self.channels[channel].remove(websocket)

if __name__ == "__main__":
    chat_server = ChatServer()

    start_server = websockets.serve(
        chat_server.handle_consumer,
        "0.0.0.0",
        8765,
    )

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

