import secrets
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.api_key import ApiKey
from app.models.webhook import Webhook
from app.schemas.partner import ApiKeyCreate, ApiKeyResponse, WebhookRequest, WebhookResponse

router = APIRouter(prefix="/partner", tags=["Partner & B2B Setup"])


@router.post("/keys", response_model=ApiKeyResponse, status_code=status.HTTP_201_CREATED)
def create_api_key(
    body: ApiKeyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Generate a random API key.
    # In a real app we'd hash this and only show it once, but for demo we just store the exact string in key_hash
    raw_key = f"sk_test_{secrets.token_urlsafe(24)}"

    api_key = ApiKey(user_id=current_user.id, name=body.name, key_hash=raw_key)
    db.add(api_key)
    db.commit()
    db.refresh(api_key)

    return api_key


@router.get("/keys", response_model=list[ApiKeyResponse])
def get_api_keys(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    keys = db.query(ApiKey).filter(ApiKey.user_id == current_user.id).all()
    return keys


@router.post("/webhook", response_model=WebhookResponse, status_code=status.HTTP_200_OK)
def set_webhook(
    body: WebhookRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    webhook = db.query(Webhook).filter(Webhook.user_id == current_user.id).first()
    url_str = str(body.url)
    if webhook:
        webhook.url = url_str
        webhook.secret = body.secret
    else:
        webhook = Webhook(user_id=current_user.id, url=url_str, secret=body.secret)
        db.add(webhook)
    
    db.commit()
    return {"url": webhook.url}
