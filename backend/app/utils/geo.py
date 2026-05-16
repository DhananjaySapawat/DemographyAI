import httpx
import ipaddress

async def get_location(ip_address):
    try:
        ip_obj = ipaddress.ip_address(ip_address)
        if ip_obj.is_private or ip_obj.is_loopback:
            return {
                "country_code": "LOCAL",
                "country_name": "Local Network",
                "state":        "Local",
                "city":         "Localhost",
            }
    except ValueError:
        return {}

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
                "country_code": data.get("country_code") or "Unknown",
                "country_name": data.get("country") or "Unknown",
                "state":        data.get("region") or "Unknown",
                "city":         data.get("city") or "Unknown",
            }
    except Exception:
        return {}