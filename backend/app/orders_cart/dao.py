from sqlalchemy import insert, update, delete
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload, selectinload
from dao.base import BaseDAO
from app.orders_cart.models import UserProductItem, Order
from app.database import async_session_maker

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
                select(cls.model).options(joinedload(cls.model.product_type))
                .where(cls.model.user_id == user_id, cls.model.order_id == None)
            )
            return [item.to_dict() for item in result.scalars().all()]

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
            cart_items = await session.scalars(
                select(cls.model)
                .options(joinedload(cls.model.product_type))
                .where(cls.model.user_id == user_id, cls.model.order_id == None)
            )
            cart_items = list(cart_items)
            if not cart_items:
                raise ValueError("Cart is empty")

            total_price = sum([item.quantity * item.product_type.price for item in cart_items])

            order = Order(user_id=user_id, total_price=total_price)
            session.add(order)
            await session.flush()

            for item in cart_items:
                item.order_id = order.id
                item.price_at_order = item.product_type.price

            await session.commit()
            return order.to_dict()

    @classmethod
    async def get_user_orders(cls, user_id: int):
        async with async_session_maker() as session:
            result = await session.execute(
                select(Order)
                .options(joinedload(Order.items).joinedload(UserProductItem.product_type))
                .where(Order.user_id == user_id)
                .order_by(Order.created_at.desc())
            )
            return [order.to_dict() for order in result.scalars().all()]