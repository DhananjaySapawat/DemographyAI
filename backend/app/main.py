from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import detect, monitor

app = FastAPI(title="DemographyAI")

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],   
)

# Register routers
app.include_router(detect.router, prefix="", tags=["Detect"])
app.include_router(monitor.router, prefix="/api", tags=["Monitor"])

