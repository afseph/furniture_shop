from sqlalchemy import insert, update, delete
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from dao.base import BaseDAO
from app.products.models import Product, Category, ProductType
from app.database import async_session_maker

class ProductDAO(BaseDAO):
    model = Product
        
    @classmethod
    async def get_all_full_data(cls, **filter_by):
        async with async_session_maker() as session:
            # Запрос для получения всех товаров с информацией о категориях
            query = select(cls.model).options(joinedload(cls.model.category)).filter_by(**filter_by)
            result = await session.execute(query)
            products_info = result.scalars().all()

            # Если товары не найдены, возвращаем пустой список
            if not products_info:
                return []

            # Преобразуем каждый товар в словарь и добавляем данные категории
            products_data = []
            for product_info in products_info:
                product_data = product_info.to_dict()
                product_data['category'] = product_info.category.name  # Используем категорию
                products_data.append(product_data)

            return products_data
        
    @classmethod
    async def find_full_data(cls, **filter_by):
        async with async_session_maker() as session:
            # Загрузка всех товаров с категориями и типами
            query = select(cls.model).options(
                joinedload(cls.model.category),
                joinedload(cls.model.product_types)
            ).filter_by(**filter_by)
            result = await session.execute(query)
            products_info = result.unique().scalars().all()

            if not products_info:
                return []

            products_data = []
            for product in products_info:
                product_data = product.to_dict()

                # Категория
                product_data['category'] = product.category.name if product.category else None

                # Типы товара
                product_data['types'] = [ptype.to_dict() for ptype in product.product_types]

                products_data.append(product_data)

            return products_data
        
    @classmethod
    async def add_product(cls, **product_data: dict):
        async with async_session_maker() as session:
            async with session.begin():
                new_product = Product(**product_data)
                session.add(new_product)
                await session.flush()
                new_product_id = new_product.id
                await session.commit()
                return new_product_id
            

class ProductTypeDAO(BaseDAO):
    model = ProductType

    @classmethod
    async def add_product_type(cls, **product_data: dict):
        async with async_session_maker() as session:
            async with session.begin():
                new_product = ProductType(**product_data)
                session.add(new_product)
                await session.flush()
                new_product_id = new_product.art
                await session.commit()
                return new_product_id

class CategoryDAO(BaseDAO):
    model = Category