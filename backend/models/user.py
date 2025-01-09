from sqlalchemy import Column, Integer, String
from Auth_API_V1.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    google_id = Column(String, unique=True, nullable=True)
    facebook_id = Column(String, unique=True, nullable=True)

