from datetime import datetime, date
from typing import Optional
import re
from pydantic import BaseModel, ConfigDict, Field, EmailStr, validator

class SProducts(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str = Field(..., min_length=1, max_length=300, 
                        description="Название товара.")
    description: str = Field(..., min_length=0, max_length=5000, 
                            description="Описание товара.")
    

class SCategoryADD(BaseModel):
    name: str = Field(..., description="Название категории.")

class SCategoryUPDATE(BaseModel):
    id: int = Field(..., description="ID Категории")
    name: str = Field(..., description='Название категории')