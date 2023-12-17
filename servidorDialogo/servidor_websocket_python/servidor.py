import asyncio
import json
import websockets

class ChatServer:
    def __init__(self):
        self.connected_clients = set()

    async def handle_message(self, websocket, message):
        
        for client in self.connected_clients:
            await client.send(message)

    async def handle_consumer(self, websocket, path):
        
        self.connected_clients.add(websocket)
        try:
            async for message in websocket:
                await self.handle_message(websocket, message)
        finally:
            
            self.connected_clients.remove(websocket)

if __name__ == "__main__":
    chat_server = ChatServer()

    start_server = websockets.serve(
        chat_server.handle_consumer,
        "localhost",
        8765,  
    )

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
