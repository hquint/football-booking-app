from sqlalchemy.orm import Session
from . import models, schemas

def create_player(db: Session, player: schemas.PlayerCreate):
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
