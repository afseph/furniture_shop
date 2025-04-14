from pydantic import BaseModel
from typing import List
from datetime import datetime

from app.products.schemas import SProductType

class SOrderItemResponse(BaseModel):
    product_type_art: int
    quantity: int
    price_at_order: int|None

class SOrderResponse(BaseModel):
    id: int
    user_id: int
    status: str
    created_at: datetime
    total_price: float
    items: List[SOrderItemResponse]