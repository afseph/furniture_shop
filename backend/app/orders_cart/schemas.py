from pydantic import BaseModel
from typing import List
from datetime import datetime

class SOrderItemResponse(BaseModel):
    product_type_art: int
    quantity: int
    price_at_order: int

class SOrderResponse(BaseModel):
    id: int
    user_id: int
    status: str
    created_at: datetime
    total_price: float
    items: List[SOrderItemResponse]