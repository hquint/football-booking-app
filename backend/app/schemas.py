from pydantic import BaseModel

class PlayerBase(BaseModel):
    name: str
    position: str | None = None

class PlayerCreate(PlayerBase):
    pass

class PlayerResponse(PlayerBase):
    id: int

    class Config:
        from_attributes = True  # Allows returning ORM model as response
