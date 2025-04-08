from fastapi import APIRouter, Depends
from sqlalchemy import select 
from app.database import async_session_maker 

from app.products.models import Product, Category
from app.products.schemas import (SProducts, SCategoryADD, SCategoryUPDATE, 
                                SCategory, SProductADD)
from app.products.dao import ProductDAO, CategoryDAO
from app.products.rb import RBProduct

router = APIRouter(prefix='/products', tags=['Products endpoints'])

@router.get('/', summary="Получить все товары")
async def get_all_products(request_body: RBProduct = Depends()) -> list[SProducts]:
    return await ProductDAO.get_all_full_data(**request_body.to_dict())

# @router.get("/{id}", summary="Получить одного студента по id")
# async def get_product_by_id(product_id: int) -> SProducts | None:
#     rez = await ProductDAO.find_one_or_none_by_id(product_id)
#     if rez is None:
#         return {'message': f'Товар с ID {product_id} не найден!'}
#     return rez

@router.post('/add/')
async def add_product(product: SProductADD):
    check = await ProductDAO.add_product(**product.dict())
    if check:
        return {'message':'Товарная группа успешно добавленна!', 
                'product': product}
    else:
        return {'message':'Ошибка при добавлении товарной группы!'}

@router.get('/categories/')
async def get_all_categories() -> list[SCategory]:
    return await CategoryDAO.get_all()

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
    
@router.delete("/delete/{category_id}")
async def delete_category(category_id: int) -> dict:
    check = await CategoryDAO.delete(id=category_id)
    if check:
        return {"message": f"Категория с ID {category_id} удалена!"}
    else:
        return {"message": "Ошибка при удалении категории!"}