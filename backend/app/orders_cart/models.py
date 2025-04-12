from sqlalchemy import ForeignKey, text, Text, Table, Column, Integer
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base, str_uniq, int_pk, str_null_true
from datetime import date


class UserProductItem(Base):
    id: Mapped[int_pk]
    user_id: Mapped[int]
    product_type_art: Mapped[int] = mapped_column(ForeignKey('producttypes.art'),
                                                  nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    price_at_order: Mapped[int|None] = mapped_column(nullable=True)

    order_id: Mapped[int|None] = mapped_column(ForeignKey('orders.id'),
                                               nullable=True)
    
    product_type = relationship('ProductType')
    order = relationship('Order', back_populates='items')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_type_art': self.product_type_art,
            'quantity': self.quantity,
            'price_at_order': self.price_at_order,
            'order_id': self.order_id,
            'product_type': self.product_type.to_dict()
        }
    

class Order(Base):
    id: Mapped[int_pk]
    user_id: Mapped[int]
    status: Mapped[str] = mapped_column(default='new')
    total_price: Mapped[float] = mapped_column(default=0.0)

    items = relationship('UserProductItem', 
                         back_populates='order', 
                         cascade='all, delete-orphan')
    
    def to_dict(self):
        return{
            'id':self.id,
            'user_id': self.user_id,
            'status':self.status,
            'total_price': self.total_price,
            'items': [item.to_dict() for item in self.items]
        }