from sqlalchemy import insert, update, delete
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload, selectinload
from dao.base import BaseDAO
from app.orders_cart.models import UserProductItem, Order
from app.database import async_session_maker

from app.products.models import ProductType

class UserProductItemDAO(BaseDAO):
    model = UserProductItem

    @classmethod
    async def add_to_cart(cls, user_id: int, product_type_art: int, quantity: int = 1):
        async with async_session_maker() as session:
            existing = await session.scalar(
                select(cls.model).where(
                    cls.model.user_id == user_id,
                    cls.model.product_type_art == product_type_art,
                    cls.model.order_id == None
                )
            )
            if existing:
                if existing.quantity > quantity:
                    _ = existing.quantity - quantity
                    existing.quantity -= _
                else:
                    existing.quantity += quantity
            else:
                session.add(cls.model(
                    user_id=user_id,
                    product_type_art=product_type_art,
                    quantity=quantity
                ))
            await session.commit()

    @classmethod
    async def get_cart(cls, user_id: int):
        async with async_session_maker() as session:
            result = await session.execute(
                select(cls.model).options(
                    joinedload(cls.model.product_type)
                    .joinedload(ProductType.characteristics)
                    )
                .where(cls.model.user_id == user_id, cls.model.order_id == None)
            )
            return [item.to_dict() for item in result.unique().scalars().all()]

    @classmethod
    async def remove_from_cart(cls, user_id: int, product_type_art: int):
        async with async_session_maker() as session:
            await session.execute(
                delete(cls.model).where(
                    cls.model.user_id == user_id,
                    cls.model.product_type_art == product_type_art,
                    cls.model.order_id == None
                )
            )
            await session.commit()

    @classmethod
    async def clear_cart(cls, user_id: int):
        async with async_session_maker() as session:
            await session.execute(
                delete(cls.model).where(cls.model.user_id == user_id, cls.model.order_id == None)
            )
            await session.commit()

    @classmethod
    async def create_order_from_cart(cls, user_id: int):
        async with async_session_maker() as session:
            cart_items_result = await session.execute(
                    select(cls.model)
                    .options(
                        joinedload(cls.model.product_type).joinedload(ProductType.characteristics)
                    )
                    .where(cls.model.user_id == user_id, cls.model.order_id == None)
                )
            cart_items = cart_items_result.unique().scalars().all()
            cart_items = list(cart_items)
            if not cart_items:
                raise ValueError("Cart is empty")

            # Проверка наличия достаточного количества товаров
            for item in cart_items:
                if item.quantity > item.product_type.amount:
                    raise ValueError(
                        f"Недостаточно товара (арт. {item.product_type.art}). В наличии: {item.product_type.amount}, требуется: {item.quantity}"
                    )

            total_price = sum([item.quantity * item.product_type.price for item in cart_items])

            order = Order(user_id=user_id, total_price=total_price)
            session.add(order)
            await session.flush()

            for item in cart_items:
                item.order_id = order.id
                item.price_at_order = item.product_type.price

                # Уменьшаем остаток товара
                item.product_type.amount -= item.quantity
                session.add(item.product_type)

            await session.commit()

            # Подгружаем все нужные связи
            await session.refresh(order)
            order_result = await session.execute(
                select(Order)
                .options(
                    joinedload(Order.items)
                    .joinedload(UserProductItem.product_type)
                    .joinedload(ProductType.characteristics)
                )
                .where(Order.id == order.id)
            )
            order = order_result.unique().scalar_one()

            return order.to_dict()


    @classmethod
    async def get_user_orders(cls, user_id: int):
        async with async_session_maker() as session:
            result = await session.execute(
                select(Order)
                .options(joinedload(Order.items).joinedload(UserProductItem.product_type)
                         .joinedload(ProductType.characteristics))
                .where(Order.user_id == user_id)
                .order_by(Order.created_at.desc())
            )

            orders = result.unique().scalars().all()

            return [order.to_dict() for order in orders]
        
    @classmethod
    async def delete_order(cls, order_id: int, user_id: int):
        async with async_session_maker() as session:
            # Загружаем все товары заказа с их типами
            result = await session.execute(
                select(cls.model)
                .options(joinedload(cls.model.product_type))
                .where(cls.model.order_id == order_id)
            )
            items = result.unique().scalars().all()

            if not items:
                raise ValueError("Заказ не найден или уже удалён")

            total_quantity = 0

            for item in items:
                total_quantity += item.quantity
                # Восстановление остатка
                item.product_type.amount += item.quantity
                session.add(item.product_type)

            # Удаляем все позиции заказа
            await session.execute(
                delete(cls.model).where(cls.model.order_id == order_id)
            )

            # Удаляем сам заказ
            await session.execute(
                delete(Order).where(Order.id == order_id, Order.user_id == user_id)
            )

            await session.commit()

            return {
                'order_id': order_id,
                'restored_quantity': total_quantity
            }
