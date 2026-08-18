from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(title="Lovise Sofa AI Engine", version="1.0.0")

# Allow Next.js frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific Next.js domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrderPayload(BaseModel):
    customerName: str
    productName: str
    productType: str
    region: str
    requestDate: str = ""
    hasBlueprint: bool = True

@app.get("/")
def read_root():
    return {"status": "AI Engine is running", "engine": "LangGraph"}

@app.post("/api/route-order")
async def route_order(payload: OrderPayload):
    """
    Endpoint called by Next.js Server Action to initiate LangGraph Supervisor
    """
    try:
        # Import and invoke the LangGraph Supervisor agent here
        from agents.supervisor import run_supervisor
        
        # Convert Pydantic model to dict
        result = run_supervisor(payload.dict())
        
        return {
            "success": True,
            "message": "Order processed by AI Supervisor",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
