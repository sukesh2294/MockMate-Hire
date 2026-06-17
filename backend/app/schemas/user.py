from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Literal, Optional


class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Literal["recruiter", "candidate"] = "candidate"


class UserRead(UserBase):
    id: str

    model_config = ConfigDict(from_attributes=True)
