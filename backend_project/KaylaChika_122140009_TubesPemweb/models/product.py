from sqlalchemy import Column, Integer, String, Float, Text
from . import Base  

class Product(Base):
    __tablename__ = 'products_1'
    __table_args__ = {'schema': 'public'}  

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    stock = Column(Integer, nullable=False, default=0)

    def __repr__(self):
        return f"<Product(id={self.id}, name='{self.name}', price={self.price})>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "image_url": self.image_url,
            "stock": self.stock
        }
