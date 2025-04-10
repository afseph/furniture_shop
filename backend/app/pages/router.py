from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates

from app.products.router import get_all_products

from app.users.router import get_me


router = APIRouter(prefix='/pages', tags=['Фронтенд'])
templates = Jinja2Templates(directory='app/templates')


@router.get('/products')
async def get_students_html(request: Request, products=Depends(get_all_products)):
    return templates.TemplateResponse(name='products.html', context={'request': request,'products':products})


@router.get('/login')
async def get_login_html(request: Request):
    return templates.TemplateResponse(name='login.html', context={'request': request})


@router.get('/register')
async def get_regiter_html(request: Request):
    return templates.TemplateResponse(name='register.html', context={'request': request})


@router.get('/profile')
async def get_my_profile(request: Request, profile=Depends(get_me)):
    return templates.TemplateResponse(name='profile.html',
                                      context={'request': request, 'profile': profile})