from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates

from app.products.router import get_all_products


router = APIRouter(prefix='/pages', tags=['Фронтенд'])
templates = Jinja2Templates(directory='app/templates')


@router.get('/products')
async def get_students_html(request: Request, products=Depends(get_all_products)):
    return templates.TemplateResponse(name='products.html', context={'request': request,'products':products})