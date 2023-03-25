import os
from pydantic import BaseSettings

PROJECT_NAME = "championship-platform"

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

API_V1_STR = "/api/v1"



class Settings(BaseSettings):
    DATABASE_URL: str
# specify .env file location as Config attribute
    class Config:
        env_file = ".env"

settings = Settings()