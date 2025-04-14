from getpass import getpass
from sqlalchemy import select

from app.database import async_session_maker
from app.users.models import User
from app.users.auth import get_password_hash

async def create_superuser():
    print('Создание суперпользователя.')
    email = input('Email: ').strip()
    password = getpass("Пароль: ")
    password2 = getpass('Повторите пароль: ')

    if password != password2:
        print('Пароли не совпадают!')
        return
    
    hashed = get_password_hash(password)

    async with async_session_maker() as session:
        res = await session.execute(
            select(User).where(User.email == email)
        )
        if res.scalar():
            print('Пользователь с таким email уже существует!')
            return
        
        user = User(
            email = email,
            password=hashed,
            is_admin=True,
            is_super_admin=True,
            phone_number='nonum',
            first_name='admin',
            last_name='admin'
        )
        session.add(user)
        await session.commit()
        print('Суперпользователь создан.')