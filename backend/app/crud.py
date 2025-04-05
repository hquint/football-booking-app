from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date, datetime, timedelta
from fastapi import HTTPException

def create_player(db: Session, player: schemas.PlayerCreate):
    existing_player = db.query(models.Player).filter(models.Player.name == player.name).first()
    if existing_player:
        raise HTTPException(status_code=400, detail="Player name already exists. Please add a surname to make it unique.")     
        
    new_player = models.Player(name=player.name, position=player.position)
    db.add(new_player)
    db.commit()
    db.refresh(new_player)
    return new_player

def get_players(db: Session):
    return db.query(models.Player).all()

def get_player_by_id(db: Session, player_id: int):
    return db.query(models.Player).filter(models.Player.id == player_id).first()

def update_player(db: Session, player_id: int, player_data: schemas.PlayerCreate):
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if player:
        player.name = player_data.name
        player.position = player_data.position
        db.commit()
        db.refresh(player)
    return player

def delete_player(db: Session, player_id: int):
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if player:
        db.delete(player)
        db.commit()
        return player
    return None

def get_thursdays():
    """
    Function to get the next 10 Thursdays from today.
    Returns a list of dates in YYYY-MM-DD format.
    """
    today = datetime.today()
    thursdays = []
    
    # Find the first upcoming Thursday
    days_until_thursday = (3 - today.weekday()) % 7
    if days_until_thursday == 0:
        days_until_thursday = 7  # If today is Thursday, move to the next one

    next_thursday = today + timedelta(days=days_until_thursday)

    # Collect the next 10 Thursdays
    for _ in range(10):
        thursdays.append(next_thursday.strftime("%Y-%m-%d"))
        next_thursday += timedelta(days=7)  # Move to the next Thursday
        
    return thursdays

# Get all attendance records
def get_all_attendance(db: Session):
    """
    Function to get all attendance records.
    Returns a list of attendance records.
    """
    # Assuming you have a model named Attendance
    # and a relationship set up with Player
    return db.query(models.Attendance).all()

# Update player attendance
def update_player_attendance(db: Session, player_id: int, date: date, status: str):
    """
    Function to update player attendance.
    If a record for the player and date exists, it updates the status.
    If not, it creates a new record.
    """
   
    attendance_record = (
        db.query(models.Attendance)
        .filter(models.Attendance.player_id == player_id, models.Attendance.date == date)
        .first()
    )

    if attendance_record:
        attendance_record.status = status  # Update existing record
    else:
        new_record = models.Attendance(player_id=player_id, date=date, status=status)
        db.add(new_record)  # Create a new record

    db.commit()
    return {"message": "Attendance updated"}