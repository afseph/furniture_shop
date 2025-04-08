from sqlalchemy import ForeignKey, text, Text
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base, str_uniq, int_pk, str_null_true
from datetime import date

class Product(Base):
    id: Mapped[int_pk]
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)\
    
    category_id: Mapped[int] = mapped_column(ForeignKey('categorys.id'), 
                                            nullable=False)

    category: Mapped['Category'] = relationship('Category', 
                                                back_populates='products')
    
    def __str__(self):
        return (f"{self.__class__.__name__}(id={self.id}, "
                f"title={self.title!r}")
    
    def __repr__(self):
        return str(self)

class Category(Base):
    id: Mapped[int_pk]
    name: Mapped[str_uniq]

    products: Mapped['Product'] = relationship("Product", 
                                            back_populates="category")

    def __str__(self):
        return f"{self.__class__.__name__}(id={self.id}, name={self.name!r})"
    
    def __repr__(self):
        return str(self)