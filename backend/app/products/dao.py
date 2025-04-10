from sqlalchemy import insert, update, delete
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload, selectinload
from dao.base import BaseDAO
from app.products.models import (Product, Category, ProductType, Characteristic,
                                characteristic_producttype)
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
    async def get_all_full_data(cls, **filter_by):
        async with async_session_maker() as session:
            # Запрос для получения всех товаров с информацией о категориях
            query = select(cls.model).options(joinedload(cls.model.characteristics)).filter_by(**filter_by)
            result = await session.execute(query)
            products_info = result.unique().scalars().all()

            # Если товары не найдены, возвращаем пустой список
            if not products_info:
                return []

            # Преобразуем каждый товар в словарь и добавляем данные категории
            products_data = []
            for product_info in products_info:
                product_data = product_info.to_dict()
                product_data["characteristics"] = [
                    {"id": char.id, "name": char.name, "value": char.value}
                    for char in product_info.characteristics
                ]
                products_data.append(product_data)

            return products_data

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


class CharacteristicDAO(BaseDAO):
    model = Characteristic

    @classmethod
    async def add_and_bind_to_producttype(cls, name: str, value: str, producttype_art: int):
        async with async_session_maker() as session:
            async with session.begin():
                # Явно загружаем characteristics у ProductType
                result = await session.execute(
                    select(ProductType)
                    .options(selectinload(ProductType.characteristics))
                    .where(ProductType.art == producttype_art)
                )
                producttype = result.scalar_one_or_none()
                if not producttype:
                    raise ValueError(f"ProductType with art {producttype_art} not found")

                # Найти или создать характеристику
                result = await session.execute(
                    select(Characteristic).where(
                        Characteristic.name == name,
                        Characteristic.value == value
                    )
                )
                characteristic = result.scalar_one_or_none()
                if not characteristic:
                    characteristic = Characteristic(name=name, value=value)
                    session.add(characteristic)
                    await session.flush()

                # Привязка
                if characteristic not in producttype.characteristics:
                    producttype.characteristics.append(characteristic)

                await session.commit()

                return {
                    "characteristic_id": characteristic.id,
                    "linked_to_producttype": producttype.art
                }

    @classmethod
    async def unbind_from_producttype(cls, producttype_art: int, characteristic_id: int):
        async with async_session_maker() as session:
            async with session.begin():
                stmt = delete(characteristic_producttype).where(
                    characteristic_producttype.c.producttype_art == producttype_art,
                    characteristic_producttype.c.char_id == characteristic_id
                )
                await session.execute(stmt)
                await session.commit()

                return {
                    "message": f"Characteristic {characteristic_id} unlinked from ProductType {producttype_art}"
                }


    @classmethod
    async def bind_to_producttype(cls, producttype_art: int, characteristic_id: int):
        async with async_session_maker() as session:
            async with session.begin():
                # Проверка: существует ли такой ProductType и Characteristic
                producttype_exists = await session.scalar(
                    select(ProductType.art).where(ProductType.art == producttype_art)
                )
                characteristic_exists = await session.scalar(
                    select(Characteristic.id).where(Characteristic.id == characteristic_id)
                )

                if not producttype_exists:
                    raise ValueError(f"ProductType with art {producttype_art} not found")
                if not characteristic_exists:
                    raise ValueError(f"Characteristic with id {characteristic_id} not found")

                # Вставка в таблицу связи
                try:
                    await session.execute(
                        insert(characteristic_producttype).values(
                            producttype_art=producttype_art,
                            char_id=characteristic_id
                        )
                    )
                except IntegrityError:
                    # Уже существует связь
                    return {
                        "message": "Characteristic already linked to ProductType",
                        'status':'error',
                        "producttype_art": producttype_art,
                        "characteristic_id": characteristic_id
                    }

                await session.commit()

                return {
                    "message": f"Characteristic {characteristic_id} linked to ProductType {producttype_art}"
                }
    

    @classmethod
    async def delete_characteristic(cls, characteristic_id: int):
        async with async_session_maker() as session:
            async with session.begin():
                # Проверка на существование
                result = await session.execute(
                    select(Characteristic).where(Characteristic.id == characteristic_id)
                )
                characteristic = result.scalar_one_or_none()

                if not characteristic:
                    raise ValueError(f"Characteristic with id {characteristic_id} not found")

                # Удаляем связи
                await session.execute(
                    delete(characteristic_producttype).where(
                        characteristic_producttype.c.char_id == characteristic_id
                    )
                )

                # Удаляем характеристику
                await session.execute(
                    delete(Characteristic).where(Characteristic.id == characteristic_id)
                )

                await session.commit()

                return {"message": f"Characteristic {characteristic_id} deleted successfully"}

    @classmethod
    async def add_characteristic(cls, **product_data: dict):
        async with async_session_maker() as session:
            async with session.begin():
                new_characterisctic = Characteristic(**product_data)
                session.add(new_characterisctic)
                await session.flush()
                new_characterisctic_id = new_characterisctic.id
                await session.commit()
                return new_characterisctic_id