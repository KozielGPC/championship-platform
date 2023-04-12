from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field
from pydantic.generics import GenericModel

T = TypeVar("T")


class TeamSchema(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    password: Optional[str] = None

    class Config:
        orm_mode = True


class UserInput(UserSchema):
    username: str
    password: str

    class Config:
        orm_mode = True


class Response(GenericModel, Generic[T]):
    code: str
    status: str
    message: str
    result: Optional[T]
