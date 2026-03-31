from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class OpenBankingTransaction(BaseModel):
    amount: Decimal = Field(..., description="Гүйлгээний дүн. Зарлага бол хасах тэмдэгтэй байж болно.")
    date: str = Field(..., description="Гүйлгээний огноо (YYYY-MM-DD)")
    category: str = Field(..., description="Гүйлгээний төрөл (жишээ нь: SALARY, GAMBLING, FOOD, UTILITY)")
    description: str | None = None


class B2BCustomerInfo(BaseModel):
    name: str
    register_no: str
    age: int = Field(ge=18)
    salary: Decimal = Field(ge=0)


class B2BLoanApplyRequest(BaseModel):
    amount: Decimal = Field(gt=0, le=50_000_000, description="Зээлийн дүн")
    term_months: int = Field(ge=1, le=60, description="Хугацаа сараар")
    customer: B2BCustomerInfo
    transactions: list[OpenBankingTransaction] = Field(default_factory=list, description="Сүүлийн саруудын гүйлгээний хуулга")
