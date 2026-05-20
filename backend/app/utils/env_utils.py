import os

def load_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise EnvironmentError(f"Environment variable '{name}' is required but not set.")
    return value