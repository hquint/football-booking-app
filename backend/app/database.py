from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get local DB URL
DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine for PostgreSQL
engine = create_engine(DATABASE_URL)

# Session and base
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
meta = MetaData()
