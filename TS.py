import asyncio
import websockets
import json

clients = set()

async def handler(websocket):
    clients.add(websocket)
    print(f"[+] New client connected ({len(clients)} total)")
    try:
        async for message in websocket:
            print("Received:", message)
            data = json.loads(message)

            # Розсилка всім клієнтам
            for client in clients:
                if client != websocket:
                    await client.send(json.dumps(data))
    except Exception as e:
        print("Error:", e)
    finally:
        clients.remove(websocket)
        print(f"[-] Client disconnected ({len(clients)} left)")

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8765):
        print("TurboServer running on ws://localhost:8000")
        await asyncio.Future()  # безкінечний цикл

if __name__ == "__main__":
    asyncio.run(main())
