from dao.base import BaseDAO
from app.users.models import User

from app.database import async_session_maker

from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from sqlalchemy import or_

 
class UsersDAO(BaseDAO):
    model = User

    @classmethod
    async def update_contact_info(cls, filter_by: dict, email: str = None, phone_number: str = None):
        async with async_session_maker() as session:
            async with session.begin():
                # Проверка на уникальность
                conditions = []
                if email:
                    conditions.append(cls.model.email == email)
                if phone_number:
                    conditions.append(cls.model.phone_number == phone_number)

                if conditions:
                    stmt = select(cls.model).where(
                        or_(*conditions),
                        ~cls.model.id.in_(
                            select(cls.model.id).where(*[
                                getattr(cls.model, k) == v for k, v in filter_by.items()
                            ])
                        )
                    )
                    result = await session.execute(stmt)
                    existing = result.scalar_one_or_none()
                    if existing:
                        raise ValueError("Email или номер телефона уже используется другим пользователем.")

                # Обновление значений
                update_values = {}
                if email:
                    update_values["email"] = email
                if phone_number:
                    update_values["phone_number"] = phone_number

                return await cls.update(filter_by, **update_values)