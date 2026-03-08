import httpx

async def get_location(ip_address):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://ipwho.is/{ip_address}",
                timeout=3
            )
            data = response.json()
            if not data.get("success"):
                return {}
            return {
                "country_code": data.get("country_code"),
                "country_name": data.get("country"),
                "state":        data.get("region"),
                "city":         data.get("city"),
            }
    except Exception:
        return {}