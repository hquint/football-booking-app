from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
import models

# Create tables (if not exist)
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Local PostgreSQL connected!"}

@app.get("/players")
def get_players(db: Session = Depends(get_db)):
    return db.query(models.Player).all()
