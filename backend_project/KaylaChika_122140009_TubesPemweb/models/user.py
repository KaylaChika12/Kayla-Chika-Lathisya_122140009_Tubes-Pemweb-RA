from sqlalchemy import Column, Integer, String
from . import Base  

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)  # hashed password

    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }
