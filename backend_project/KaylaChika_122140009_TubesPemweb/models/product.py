from sqlalchemy import Column, Integer, String
from .meta import Base  # ✅ Sesuai dengan struktur kamu

class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    description = Column(String, nullable=True)
    image = Column(String, nullable=True)
