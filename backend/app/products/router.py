from fastapi import APIRouter 
from sqlalchemy import select 
from app.database import async_session_maker 
from app.products.models import Product, Category

router = APIRouter(prefix='/products', tags=['Products endpoints'])

@router.get('/', summary="Получить все товары")
async def get_all_products():
    async with async_session_maker() as session:
        query = select(Product)
        result = await session.execute(query)
        students = result.scalars().all()
        return students