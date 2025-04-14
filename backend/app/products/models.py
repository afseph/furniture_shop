from sqlalchemy import ForeignKey, text, Text, Table, Column, Integer
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base, str_uniq, int_pk, str_null_true
from datetime import date

characteristic_producttype = Table('charsproducttyperelation', Base.metadata,
            Column('char_id', Integer, ForeignKey('characteristics.id')),
            Column('producttype_art', Integer, ForeignKey('producttypes.art'))
                                )


class Product(Base):
    id: Mapped[int_pk]
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)\
    
    category_id: Mapped[int] = mapped_column(ForeignKey('categorys.id'), 
                                            nullable=False)

    category: Mapped['Category'] = relationship('Category', 
                                                back_populates='products')
    
    product_types: Mapped[list['ProductType']] = relationship('ProductType',
                                                        back_populates='product',
                                                        cascade="all, delete-orphan")
    
    def __str__(self):
        return (f"{self.__class__.__name__}(id={self.id}, "
                f"title={self.title!r})")
    
    def __repr__(self):
        return str(self)

    def to_dict(self):
        return{
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category_id': self.category_id
        }


class Category(Base):
    id: Mapped[int_pk]
    name: Mapped[str_uniq]

    products: Mapped['Product'] = relationship("Product", 
                                            back_populates="category")

    def __str__(self):
        return f"{self.__class__.__name__}(id={self.id}, name={self.name!r})"
    
    def __repr__(self):
        return str(self)


class ProductType(Base):
    art: Mapped[int_pk]
    amount: Mapped[int]
    price: Mapped[float]

    product_id: Mapped[int] = mapped_column(ForeignKey('products.id'), nullable=False)

    product: Mapped['Product'] = relationship('Product', 
                                            back_populates='product_types')
    
    characteristics = relationship('Characteristic',
                                                            back_populates='producttype',
                                                            secondary='charsproducttyperelation')
    
    def __str__(self):
        return (f"{self.__class__.__name__}(art={self.art})")

    def __repr__(self):
        return str(self)

    def to_dict(self):
        return {
            'art': self.art,
            'amount':self.amount,
            'price':self.price,
            'product_id': self.product_id,
            'characteristics':[
                {'id':c.id, 'name':c.name, 'value':c.value} for c in self.characteristics
            ]
        }


class Characteristic(Base):
    id: Mapped[int_pk]
    name: Mapped[str]
    value: Mapped[str]

    producttype = relationship('ProductType',
                                                    back_populates='characteristics',
                                                    secondary='charsproducttyperelation')

    def __str__(self):
        return (f"{self.__class__.__name__}(id={self.id})")

    def __repr__(self):
        return str(self)