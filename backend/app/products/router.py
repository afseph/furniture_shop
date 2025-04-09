from fastapi import APIRouter, Depends
from sqlalchemy import select 
from app.database import async_session_maker 

from app.products.models import Product, Category
from app.products.schemas import (SProducts, SCategoryADD, SCategoryUPDATE, 
                                SCategory, SProductADD, SProductTypeADD,
                                SProductTypeUPDATEprice, SProductTypeUPDATEamount,
                                SProductTypeUPDATEproduct)
from app.products.dao import ProductDAO, CategoryDAO, ProductTypeDAO
from app.products.rb import RBProduct

router = APIRouter(prefix='/products')

@router.get('/all/', summary="Получить все товары", tags=["Product Groups"])
async def get_all_products(request_body: RBProduct = Depends()) -> list[SProducts]:
    return await ProductDAO.find_full_data(**request_body.to_dict())

# @router.get("/{id}", summary="Получить одного студента по id")
# async def get_product_by_id(product_id: int) -> SProducts | None:
#     rez = await ProductDAO.find_one_or_none_by_id(product_id)
#     if rez is None:
#         return {'message': f'Товар с ID {product_id} не найден!'}
#     return rez

@router.get('/types/all/', tags = ['Product Types'])
async def get_all_product_types():
    return await ProductTypeDAO.get_all()


@router.post('/types/add/', tags=['Product Types'])
async def add_product_type(producttype: SProductTypeADD) -> dict:
    check = await ProductTypeDAO.add_product_type(**producttype.dict())
    if check:
        return {'message':'Товар успешно добавлен!',
                'product': producttype}
    else:
        return {'message':'Ошибка при добалении товара!'}


@router.put('/types/amount/update/', summary='Изменение остатоков товара.', tags=['Product Types'])
async def update_product_type_amount(producttype: SProductTypeUPDATEamount) -> dict:
    check = await ProductTypeDAO.update(filter_by={'art':producttype.art},
                                        amount=producttype.amount)
    if check:
        return {'message':'Остаток товара успешно обновлен!',
                'art':producttype.art,
                'remains':producttype.amount}
    else:
        return {
                'message':
                f'Ошибка при обновлении остатоков товара с артикулом {producttype.art}'
                }


@router.put('/types/price/update/', summary='Изменение цены товара.', tags=['Product Types'])
async def update_product_type_price(producttype: SProductTypeUPDATEprice) -> dict:
    check = await ProductTypeDAO.update(filter_by={'art':producttype.art},
                                        price=producttype.price)
    if check:
        return {'message':'Цена товара успешно обновлена!',
                'art':producttype.art,
                'price':producttype.price}
    else:
        return {
                'message':
                f'Ошибка при обновлении цены товара с артикулом {producttype.art}'
                }


@router.put('/types/product/update/', summary='Изменение товарной группы товара.', tags=['Product Types'])
async def update_product_type_product(producttype: SProductTypeUPDATEproduct) -> dict:
    check = await ProductTypeDAO.update(filter_by={'art':producttype.art},
                                        product_id=producttype.product_id)
    if check:
        return {'message':'Товарная группа товара успешно обновлена!',
                'art':producttype.art,
                'product_id':producttype.product_id}
    else:
        return {
                'message':
                f'Ошибка при обновлении товарной группы товара с артикулом {producttype.art}'
                }


@router.delete('/types/delete/{type_art}', tags=['Product Types'])
async def delete_product_type(type_art: int) -> dict:
    check = await ProductTypeDAO.delete(art=type_art)
    if check:
        return {'message':f'Товар с артикулом {type_art} успешно удален!'}
    else:
        return {'message':f'Ошибка при удалении товара с артикулом {type_art}'}


@router.post('/add/', tags=['Product Groups'])
async def add_product(product: SProductADD):
    check = await ProductDAO.add_product(**product.dict())
    if check:
        return {'message':'Товарная группа успешно добавленна!', 
                'product': product}
    else:
        return {'message':'Ошибка при добавлении товарной группы!'}


@router.delete('/delete/{product_id}', tags=['Product Groups'])
async def delete_product(product_id: int) -> dict:
    check = await ProductDAO.delete(id = product_id)
    if check:
        return {'message':f'Товарная группа с ID {product_id} успешно удаленна!'}
    else:
        return {'message':f'Ошибка при удалении товарной группы с ID {product_id}'}


@router.get('/categories/', tags=['Categories'])
async def get_all_categories() -> list[SCategory]:
    return await CategoryDAO.get_all()


@router.post('/category/add/', tags=['Categories'])
async def add_category(category: SCategoryADD) -> dict:
    check = await CategoryDAO.add(**category.dict())
    if check:
        return {'message':'Категория успешно добавленна!', 
                'category':category}
    else:
        return {'message':'Ошибка при добавлении категории!'}


@router.put('/category/update/', tags=['Categories'])
async def update_category(category: SCategoryUPDATE) -> dict:
    check = await CategoryDAO.update(filter_by={'id':category.id},
                                    name=category.name)
    if check:
        return {'message':'Название категории обновленно!', 
                'category':category}
    else:
        return {'message':'Ошибка при обновлении названия категории!'}


@router.delete("/delete/{category_id}", tags=['Categories'])
async def delete_category(category_id: int) -> dict:
    check = await CategoryDAO.delete(id=category_id)
    if check:
        return {"message": f"Категория с ID {category_id} удалена!"}
    else:
        return {"message": "Ошибка при удалении категории!"}