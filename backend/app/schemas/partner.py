from pydantic import BaseModel, HttpUrl

class ApiKeyCreate(BaseModel):
    name: str

class ApiKeyResponse(BaseModel):
    id: int
    name: str
    key_hash: str

class WebhookRequest(BaseModel):
    url: HttpUrl
    secret: str

class WebhookResponse(BaseModel):
    url: HttpUrl
