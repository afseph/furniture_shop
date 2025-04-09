from datetime import datetime, date
from typing import Optional
import re
from pydantic import BaseModel, ConfigDict, Field, EmailStr, validator

from .models import ProductType

class SProducts(BaseModel):
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)

    id: int
    title: str = Field(..., min_length=1, max_length=300, 
                        description="Название товара.")
    description: str = Field(..., min_length=0, max_length=5000, 
                            description="Описание товара.")
    category: Optional[str] = Field(..., description="Название категории.")
    types: Optional[list[dict]|None] = Field(..., 
                                            description="Товары в категории.")

class SProductADD(BaseModel):
    title: str = Field(..., description="Название товара.")
    description: str = Field(..., description="Описание товара.")
    category_id: int = Field(..., description="ID Категории.")


class SProductTypeADD(BaseModel):
    art: int = Field(..., description="Артикул товара")
    amount: int = Field(..., description="Остаток")
    price: float = Field(..., description="Цена товара")
    product_id: int = Field(..., description="ID товарной группы")

class SCategory(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str = Field(..., description="Название категории.")

class SCategoryADD(BaseModel):
    name: str = Field(..., description="Название категории.")

class SCategoryUPDATE(BaseModel):
    id: int = Field(..., description="ID Категории")
    name: str = Field(..., description='Название категории')