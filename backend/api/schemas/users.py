from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field, validator
from pydantic.generics import GenericModel
import re

T = TypeVar("T")


class UserSchema(BaseModel):
    id: Optional[int] = None
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None

    class Config:
        orm_mode = True


class UserInput(UserSchema):
    username: str
    password: str
    email: str

    @validator("*")
    def check_empty_fields(cls, v):
        assert v != "", "Empty strings are not allowed."
        return v

    @validator("*")
    def check_spaced_fields(cls, v):
        assert v.strip(), "Empty strings are not allowed."
        return v

    @validator("email")
    def validate_email(cls, email):
        if email is not None:
            assert re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email), "Invalid email format."
        return email

    class Config:
        orm_mode = True


class UserUpdateRequest(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None

    @validator("*")
    def check_empty_fields(cls, v):
        assert v != "", "Empty strings are not allowed."
        return v

    @validator("*")
    def check_spaced_fields(cls, v):
        assert v.strip(), "Empty strings are not allowed."
        return v

    @validator("email")
    def validate_email(cls, email):
        if email is not None:
            assert re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email), "Invalid email format."
        return email

    class Config:
        extra = "forbid"


class Response(GenericModel, Generic[T]):
    code: str
    status: str
    message: str
    result: Optional[T]
