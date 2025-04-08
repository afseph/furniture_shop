from fastapi import APIRouter, Depends
from sqlalchemy import select 
from app.database import async_session_maker 

from app.products.models import Product, Category
from app.products.schemas import SProducts, SCategoryADD, SCategoryUPDATE
from app.products.dao import ProductDAO, CategoryDAO
from app.products.rb import RBProduct

router = APIRouter(prefix='/products', tags=['Products endpoints'])

@router.get('/', summary="Получить все товары")
async def get_all_products(request_body: RBProduct = Depends()) -> list[SProducts]:
    return await ProductDAO.get_all(**request_body.to_dict())

@router.get("/{id}", summary="Получить одного студента по id")
async def get_product_by_id(product_id: int) -> SProducts | None:
    rez = await ProductDAO.find_one_or_none_by_id(product_id)
    if rez is None:
        return {'message': f'Студент с ID {product_id} не найден!'}
    return rez

@router.post('/category/add/')
async def add_category(category: SCategoryADD) -> dict:
    check = await CategoryDAO.add(**category.dict())
    if check:
        return {'message':'Категория успешно добавленна!', 
                'category':category}
    else:
        return {'message':'Ошибка при добавлении категории!'}
    
@router.put('/category/update/')
async def update_category(category: SCategoryUPDATE) -> dict:
    check = await CategoryDAO.update(filter_by={'id':category.id},
                                    name=category.name)
    if check:
        return {'message':'Название категории обновленно!', 
                'category':category}
    else:
        return {'message':'Ошибка при обновлении названия категории!'}