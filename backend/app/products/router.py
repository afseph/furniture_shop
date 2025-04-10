from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select 
from app.database import async_session_maker 

from app.products.models import Product, Category
from app.products.schemas import (SProducts, SCategoryADD, SCategoryUPDATE, 
                                SCategory, SProductADD, SProductTypeADD,
                                SProductTypeUPDATEprice, SProductTypeUPDATEamount,
                                SProductTypeUPDATEproduct, SCharacterisricsADD,
                                SCharacteristicBINDINGdata, SCharacteristic)
from app.products.dao import ProductDAO, CategoryDAO, ProductTypeDAO, CharacteristicDAO
from app.products.rb import RBProduct, RBCharacteristic

router = APIRouter(prefix='/products')

# ! PRODUCT GROUPS SECTION

@router.get('/all/', summary="Получить все товары", tags=["Product Groups"])
async def get_all_products(request_body: RBProduct = Depends()) -> list[SProducts]:
    return await ProductDAO.find_full_data(**request_body.to_dict())


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


# ! PRODUCT TYPES SECTION

@router.get('/types/all/', tags = ['Product Types'])
async def get_all_product_types():
    return await ProductTypeDAO.get_all_full_data()


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


# !PRODUCT CHARACTERISTICS SECTION

@router.get('/characteristic/all/', tags=['Product Characteristics'])
async def get_all_chars(request_body: RBCharacteristic = Depends()) -> list[SCharacteristic]:
    return await CharacteristicDAO.get_all(**request_body.to_dict())


@router.post('/characteristic/add/', tags=['Product Characteristics'])
async def add_characteristic(characterisctic: SCharacterisricsADD)->dict:
    check = await CharacteristicDAO.add_and_bind_to_producttype(**characterisctic.dict())
    print(check)
    if check:
        return {'message':'Характеристика успешно добавленна!', 
                'characteristic':characterisctic,
                }
    else:
        return {'message':'Ошибка при добавлении хакартеристики!'}


@router.put('/characteristic/unbind/', tags=['Product Characteristics'])
async def unbind_characteristic(unbind_data:SCharacteristicBINDINGdata):
    check = await CharacteristicDAO.unbind_from_producttype(**unbind_data.dict())
    if check:
        return {'message':
                f'Характеристика с ID {unbind_data.characteristic_id} успешно отвязана!',
                'dev_data':unbind_data}
    else:
        return {'message':'Ошибка при отвязке характеристики!',
                'dev_data':unbind_data}


@router.put('/characteristic/bind/', tags=['Product Characteristics'])
async def bind_characteristic(unbind_data:SCharacteristicBINDINGdata):
    check = await CharacteristicDAO.bind_to_producttype(**unbind_data.dict())
    if check.get('status') is not None:
        return {'message':
                f'Характеристика с ID {unbind_data.characteristic_id} уже привязанна!',
                'dev_data':check}
    elif check:
        return {'message':
                f'Характеристика с ID {unbind_data.characteristic_id} успешно привязанна!',
                'dev_data':check}
    else:
        return {'message':'Ошибка при привязке характеристики!',
                'dev_data':unbind_data}


@router.delete("/characteristics/delete/{characteristic_id}", tags=['Product Characteristics'])
async def delete_characteristic(characteristic_id: int):
    try:
        result = await CharacteristicDAO.delete_characteristic(characteristic_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ! CATEGORY SECTION

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