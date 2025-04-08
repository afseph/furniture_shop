from sqlalchemy import insert, update, delete
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from dao.base import BaseDAO
from app.products.models import Product, Category
from app.database import async_session_maker

class ProductDAO(BaseDAO):
    model = Product

    @classmethod
    async def find_full_data(cls, product_id: int):
        async with async_session_maker() as session:
            # Запрос для получения информации о студенте вместе с информацией о факультете
            query = select(cls.model).options(joinedload(cls.model.category)).filter_by(id=product_id)
            result = await session.execute(query)
            product_info = result.scalar_one_or_none()

            # Если студент не найден, возвращаем None
            if not product_info:
                return None

            product_data = product_info.to_dict()
            product_data['category'] = product_info.major.major_name
            return product_data

class CategoryDAO(BaseDAO):
    model = Category