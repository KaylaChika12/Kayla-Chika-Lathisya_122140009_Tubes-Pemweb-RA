from sqlalchemy import Column, String, Text, DECIMAL, TIMESTAMP, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .meta import Base
import uuid

class Order(Base):
    __tablename__ = 'orders'

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    order_date = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    customer_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    address = Column(Text, nullable=False)
    payment_method = Column(String, nullable=False)
    status = Column(String, nullable=False, server_default='pending_payment')
    proof_of_payment_url = Column(String)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"), onupdate=text("CURRENT_TIMESTAMP"))

    user = relationship("User", backref="orders")
    items = relationship("OrderItem", back_populates="order")

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "order_date": self.order_date.isoformat(),
            "total_amount": float(self.total_amount),
            "customer_name": self.customer_name,
            "phone_number": self.phone_number,
            "address": self.address,
            "payment_method": self.payment_method,
            "status": self.status,
            "proof_of_payment_url": self.proof_of_payment_url,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    def __repr__(self):
        return f"<Order(id='{self.id}', user_id='{self.user_id}', total_amount='{self.total_amount}', status='{self.status}')>"