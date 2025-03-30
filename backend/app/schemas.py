from pydantic import BaseModel
from datetime import date

# the base is just an example structure on how could it be done if other palyers classes would share the same base
class PlayerBase(BaseModel):
    name: str
    position: str | None = None

class PlayerCreate(PlayerBase):
    pass

class PlayerResponse(PlayerBase):
    id: int

    class Config:
        from_attributes = True  # Allows returning ORM model as response

# the attendance class is similar, but in this case we don't have a base class
# because we don't have other classes that would share the same base
class AttendanceCreate(BaseModel):
    player_id: int
    date: date
    status: str  # "yes", "no", "maybe"

class AttendanceResponse(AttendanceCreate):
    id: int
