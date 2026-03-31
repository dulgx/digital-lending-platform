import httpx
import json
import hashlib
import hmac
from sqlalchemy.orm import Session
from app.models.webhook import Webhook
from app.models.loan_application import LoanApplication

def fire_webhook_event(db: Session, user_id: int, event_type: str, payload: dict):
    """
    Finds if the user has a webhook registered and sends an HTTP POST with the payload.
    In a production system, use Celery and exponential backoff retry logic.
    """
    webhook = db.query(Webhook).filter(Webhook.user_id == user_id).first()
    if not webhook:
        return
    
    # Create signature for security
    payload_str = json.dumps(payload, separators=(',', ':'))
    signature = hmac.new(
        webhook.secret.encode("utf-8"),
        payload_str.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    headers = {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
        "X-Event-Type": event_type
    }

    try:
        # Send Webhook synchronously since this is running in a BackgroundTask
        with httpx.Client() as client:
            response = client.post(webhook.url, content=payload_str, headers=headers, timeout=10.0)
            response.raise_for_status()
            print(f"Webhook {event_type} delivered to {webhook.url} successfully.")
    except Exception as e:
        print(f"Failed to deliver webhook to {webhook.url}: {e}")
