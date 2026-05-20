from dotenv import load_dotenv
load_dotenv() 

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import detect, monitor
from app.startup import init_startup
from app.config import WEBSITE_NAME, ALLOWED_ORIGINS

# -----------------------------
# Logging Setup
# -----------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

# -----------------------------
# FastAPI App
# -----------------------------
app = FastAPI(title=f"{WEBSITE_NAME}-BACKEND")

# -----------------------------
# CORS Middleware
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Startup Initialization
# -----------------------------
init_startup(app)

# -----------------------------
# Routers
# -----------------------------
app.include_router(detect.router, prefix="", tags=["Detect"])
app.include_router(monitor.router, prefix="/api/monitor", tags=["Monitor"])