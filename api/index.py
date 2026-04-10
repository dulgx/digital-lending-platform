import sys
import os

# Make the backend package importable from the sibling directory
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from mangum import Mangum
from main import app  # noqa: E402 — import after sys.path setup

# Mangum wraps the ASGI FastAPI app for Vercel's Python serverless runtime.
# api_gateway_base_path="/api" strips the "/api" prefix so FastAPI sees
# its own route prefixes (e.g. /auth, /loans) rather than /api/auth, /api/loans.
handler = Mangum(app, lifespan="off", api_gateway_base_path="/api")
