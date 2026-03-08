from fastapi import APIRouter

router = APIRouter()

@router.get("/kpi")
async def get_kpis():
    return {
        "images": {
            "total_count": 1240,
            "upload_snapshot_ratio": {
                "uploads": 78,
                "snapshots": 22
            },
            "weekly_growth_percentage": 6.8
        },
        "snapshots": {
            "total_count": 860,
            "weekly_growth_percentage": 4.2
        },
        "videos": {
            "total_count": 145,
            "weekly_growth_percentage": 2.9
        },
        "storage_usage": {
            "total_size_gb": 18.73,
            "weekly_growth_percentage": 5.1
        }
    }
