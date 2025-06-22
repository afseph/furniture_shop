from fastapi import APIRouter, HTTPException, status, Response, Depends
from fastapi.responses import JSONResponse
from app.users.auth import (get_password_hash, authenticate_user, 
                            create_access_token, verify_password)
from app.users.dependencies import (get_current_user, get_current_admin_user,
                                    get_curr_user_id, check_is_user_admin)
from app.users.dao import UsersDAO
from app.users.models import User
from app.users.schemas import (SUserRegister, SUserAuth, SUserUpdateName, 
                               SUserUpdateLastName, SUserUpdateEmail, 
                               SUserUpdatePassword, SUserUpdatePhone)



router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post("/register/")
async def register_user(user_data: SUserRegister) -> dict:
    user = await UsersDAO.find_one_or_none(email = user_data.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='Email или номер телефона уже используется!'
        )
    
    user = await UsersDAO.find_one_or_none(phone_number = user_data.phone_number)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='Email или номер телефона уже используется!'
        )
    user_dict = user_data.dict()
    user_dict['password'] = get_password_hash(user_data.password)
    await UsersDAO.add(**user_dict)
    return {'message': 'Вы успешно зарегистрированы!'}


@router.post("/login/")
async def auth_user(response: Response, user_data: SUserAuth):
    check = await authenticate_user(email=user_data.email, password=user_data.password)
    if check is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Неверная почта или пароль')
    access_token = create_access_token({"sub": str(check.id)})
    response.set_cookie(key="users_access_token", value=access_token, httponly=True)
    return {'access_token': access_token, 'refresh_token': None, 'message':'Авторизация успешно выполнена!'}


@router.get("/me/")
async def get_me(user_data: User = Depends(get_current_user)):
    return user_data


@router.post("/logout/")
async def logout_user(response: Response):
    response.delete_cookie(key="users_access_token")
    return {'message': 'Пользователь успешно вышел из системы'}


@router.get("/all_users/")
async def get_all_users(user_data: User = Depends(get_current_admin_user)):
    return await UsersDAO.get_all()


@router.get('/is_admin/')
async def is_user_admin(is_admin: User = Depends(check_is_user_admin)):
    return JSONResponse(content={'isAdmin': is_admin}, 
                        status_code=status.HTTP_200_OK)


@router.put("/update/name/")
async def update_user_first_name(new_name: SUserUpdateName,
                                 user_id: User = Depends(get_curr_user_id)):
    """
        USER WILL BE GOT FROM CURRENT USER TOKEN
    """

    check = await UsersDAO.update(filter_by={"id":user_id}, 
                                  first_name = new_name.first_name)
    
    print(check)
    
    if check:
        return JSONResponse(content={'status':'success',
                'message':'Имя пользователя успешно обновленно!', 
                'new_name':new_name.first_name}, status_code=200)
    else:
        return JSONResponse(content={
                'type': 'error',
                'message': 'Ошибка при изменении имени пользователя',
                'new_name': new_name.first_name
                }, status_code=500)


@router.put("/update/lastname/")
async def update_user_last_name(new_lstname: SUserUpdateLastName,
                                 user_id: User = Depends(get_curr_user_id)):
    """
        USER WILL BE GOT FROM CURRENT USER TOKEN
    """

    check = await UsersDAO.update(filter_by={"id":user_id}, 
                                  last_name = new_lstname.last_name)
    
    if check:
        return JSONResponse(content={'status':'success',
                                     'message':'Имя пользователя успешно обновленно!', 
                'new_name':new_lstname.last_name}, status_code=200)
    else:
        return JSONResponse(content={
                'type': 'error',
                'message': 'Ошибка при изменении имени пользователя',
                'new_name': new_lstname.last_name
                }, status_code=500)


@router.put('/update/email/')
async def update_user_email(new_email: SUserUpdateEmail,
                            user_id: User = Depends(get_curr_user_id)):
    try:
        check = await UsersDAO.update_contact_info(filter_by={'id':user_id},
                                                    email=new_email.email)
        return JSONResponse(content={'status':'success',
                                     'message':"Почта успешно изменена!"},
                                     status_code=200)
    except:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail='Почта уже используется!')


@router.put('/update/phone/')
async def update_user_phone(new_phone: SUserUpdatePhone,
                            user_id: User = Depends(get_curr_user_id)):
    try:
        check = await UsersDAO.update_contact_info(filter_by={'id':user_id},
                                                    phone_number=new_phone.phone_number)
        return JSONResponse(content={'status':'success',
                                        'message':"Телефон успешно изменен!"},
                                        status_code=200)
    except:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail='Телефон уже используется!')


@router.put('/update/password/')
async def update_user_password(pass_data: SUserUpdatePassword,
                                user_data: User = Depends(get_current_user)):

    user_data = user_data.to_dict()
    check_pass = verify_password(pass_data.old_password, user_data.get('password'))

    if not check_pass:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail='Введен неправильно старый пароль!')

    hashed_new_pass = get_password_hash(pass_data.new_password)

    try:
        check = await UsersDAO.update(filter_by={'id':user_data.get('id')},
                                    password = hashed_new_pass)

        if check:
            return JSONResponse(content={
                'status':'success',
                'message':'Пароль успешно изменен!',
            }, status_code=200)
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail='Что-то пошло не так!')
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail='Что-то пошло не так!')