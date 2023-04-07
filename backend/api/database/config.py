from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# DATABASE_URL = "postgres://postgres:6rxTSch1Y1Amosz@championship-platform.flycast:5432/championship-platform"
DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, echo=True)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
