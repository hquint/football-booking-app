from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import Base, engine, SessionLocal
from . import models, schemas, crud

# Create tables (if not exist)
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow CORS for the frontend React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

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

# 🟢 CREATE a new player
@app.post("/players/", response_model=schemas.PlayerResponse)
def create_player(player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    return crud.create_player(db, player)

# 🔵 READ all players
@app.get("/players/", response_model=list[schemas.PlayerResponse])
def read_players(db: Session = Depends(get_db)):
    return crud.get_players(db)

# 🔵 READ a single player
@app.get("/players/{player_id}", response_model=schemas.PlayerResponse)
def read_player(player_id: int, db: Session = Depends(get_db)):
    player = crud.get_player_by_id(db, player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

# 🟠 UPDATE a player
@app.put("/players/{player_id}", response_model=schemas.PlayerResponse)
def update_player(player_id: int, player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    updated_player = crud.update_player(db, player_id, player)
    if not updated_player:
        raise HTTPException(status_code=404, detail="Player not found")
    return updated_player

# 🔴 DELETE a player
@app.delete("/players/{player_id}")
def delete_player(player_id: int, db: Session = Depends(get_db)):
    deleted_player = crud.delete_player(db, player_id)
    if not deleted_player:
        raise HTTPException(status_code=404, detail="Player not found")
    return {"message": "Player deleted successfully"}