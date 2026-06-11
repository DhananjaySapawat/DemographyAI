from fastapi import APIRouter, HTTPException, Request, Depends
from app.security import require_session
from app.providers import database
import psutil
import os
import sys
import platform
import socket
from datetime import datetime

db_queries = database.query
#router = APIRouter(dependencies=[Depends(require_session)])
router = APIRouter()

@router.get("/media")
def get_media(request: Request):  
    request_url = request.headers.get("origin") or str(request.base_url)
    return db_queries.get_media(request_url)  


@router.get("/media/{request_id}")
def get_media_by_request_id(request_id: str, request: Request):  
    request_url = request.headers.get("origin") or str(request.base_url)
    item = db_queries.get_media_by_request_id(request_id, request_url)  
    if not item:
        raise HTTPException(status_code=404, detail="Media not found")
    return item

# ── System ────────────────────────────────────────────────────────────────────

@router.get("/system")
def system_stats():
    return {
        "cpu": {
            "percent": psutil.cpu_percent(interval=0.5),
            "cores":   psutil.cpu_count(),
        },
        "ram": {
            "total":     psutil.virtual_memory().total,
            "used":      psutil.virtual_memory().used,
            "available": psutil.virtual_memory().available,
            "percent":   psutil.virtual_memory().percent,
        },
        "disk": {
            "total":   psutil.disk_usage("/").total,
            "used":    psutil.disk_usage("/").used,
            "percent": psutil.disk_usage("/").percent,
        },
    }


@router.get("/system/process")
def process_stats():
    proc = psutil.Process(os.getpid())
    with proc.oneshot():
        return {
            "pid":        proc.pid,
            "cpu_percent": proc.cpu_percent(interval=0.5),
            "ram_mb":     round(proc.memory_info().rss / 1024 ** 2, 2),
            "threads":    proc.num_threads(),
            "uptime_sec": int(datetime.now().timestamp() - proc.create_time()),
        }


@router.get("/system/info")
def system_info():
    return {
        "hostname":      socket.gethostname(),
        "os":            f"{platform.system()} {platform.release()}",
        "python_version": sys.version.split()[0],
        "cpu_cores":     psutil.cpu_count(logical=False),
        "cpu_threads":   psutil.cpu_count(logical=True),
        "ram_total_gb":  round(psutil.virtual_memory().total / 1024 ** 3, 2),
        "disk_total_gb": round(psutil.disk_usage("/").total / 1024 ** 3, 2),
    }