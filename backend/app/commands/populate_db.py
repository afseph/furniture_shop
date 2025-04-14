from app.products.models import Product, ProductType, Category, Characteristic
from app.database import async_session_maker

from sqlalchemy import insert, select, text
from sqlalchemy.dialects.postgresql import insert as pg_insert

async def populate_db():
    async with async_session_maker() as session:
        print("Заполняем базу тестовыми данными...")

        # Вставляем категории
        res = await session.execute(
            insert(Category).returning(Category.id).values([
                {"name": "Стулья"},
                {"name": "Столы"}
            ])
        )
        chairs_id, tables_id = res.scalars().all()

        # Вставляем продукты
        res = await session.execute(
            insert(Product).returning(Product.id).values([
                {"title": "Стул кухонный", "description": "Стул кухонный", "category_id": chairs_id},
                {"title": "Стол кухонный", "description": "Стол кухонный", "category_id": tables_id}
            ])
        )
        chair_p_id, table_p_id = res.scalars().all()

        # Вставляем вариации
        res = await session.execute(
            insert(ProductType).returning(ProductType.art).values([
                {"art": 1001, "amount": 10, "price": 4999.99, "product_id": chair_p_id},
                {"art": 2001, "amount": 25, "price": 19000, "product_id": table_p_id}
            ])
        )
        chair_type_art, table_type_art = res.scalars().all()

        # Вставляем характеристики
        res = await session.execute(
            insert(Characteristic).returning(Characteristic.id).values([
                {"name": "Цвет", "value": "Черный"},
                {"name": "Высота", "value": "70см"},
                {"name": "Высота", "value": "1.3м"},
            ])
        )
        char1_id, char2_id, char3_id = res.scalars().all()

        # Привязываем характеристики
        await session.execute(
            text("INSERT INTO charsproducttyperelation (char_id, producttype_art) VALUES (:c1, :a1), (:c3, :a2), (:c2, :a1)"),
            {"c1": char1_id, "a1": chair_type_art, "c2": char2_id, "a2": table_type_art, 'c3': char3_id}
        )

        await session.commit()
        print("База данных успешно заполнена тестовыми данными.")