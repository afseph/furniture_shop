from fastapi import APIRouter, Depends
from sqlalchemy import select 
from app.database import async_session_maker 

from app.products.models import Product, Category
from app.products.schemas import SProducts
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