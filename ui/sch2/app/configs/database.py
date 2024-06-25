

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import Settings


settings = Settings()


# If using PyMySQL
MYSQL_DATABASE_URL = f"mysql+pymysql://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}"

MYSQL_DATABASE_URL_DB2 = f"mysql+pymysql://{settings.db2_user}:{settings.db2_password}@{settings.db2_host}:{settings.db2_port}/{settings.db2_name}"




engine = create_engine(
    MYSQL_DATABASE_URL, echo=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Second database configs.
engine_db2 = create_engine(
	MYSQL_DATABASE_URL_DB2, echo=True
)

SessionLocalDB2 = sessionmaker(autocommit=False, autoflush=False, bind=engine_db2)
BaseDB2 = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_db2():
    db2 = SessionLocalDB2()
    try:
        yield db2
    finally:
        db2.close()
