from sqlalchemy import text

from app.database import async_session_maker
from app.products.models import (
    Product, ProductType, Category, characteristic_producttype
)
from app.orders_cart.models import (
    Order, UserProductItem
)

async def clear_db():
    print('ВНИМАНИЕ! Это удалит ВСЕ данные из базы.')
    confirm = input("Вы уверены? Введите 'yes' для подтверждения: ").strip().lower()

    if confirm != 'yes':
        print('Операция отменена!')
        return

    async with async_session_maker() as session:
        print('Clearing database...')
        await session.execute(text("DELETE FROM charsproducttyperelation"))
        await session.execute(text("DELETE FROM userproductitems"))
        await session.execute(text("DELETE FROM orders"))
        await session.execute(text("DELETE FROM producttypes"))
        await session.execute(text("DELETE FROM products"))
        await session.execute(text("DELETE FROM characteristics"))
        await session.execute(text("DELETE FROM categorys"))

        await session.commit()
        print('Database cleared sucessfully.')