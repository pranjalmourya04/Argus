from .routes.analytics import router as analytics_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.analyze import router as analyze_router
from fastapi import WebSocket
from .websocket_manager import manager


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "https://argus-ai-tau.vercel.app"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)
    

app.include_router(analyze_router)

@app.get("/")
def root():
    return {"message": "ARGUS Fraud Detection API Running"}

app.include_router(analytics_router)

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            await websocket.receive_text()
    except:
        manager.disconnect(websocket)
