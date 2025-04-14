from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.orders_cart.dao import UserProductItemDAO
from app.orders_cart.schemas import SOrderItemResponse, SOrderResponse, SCartItemResponse

from app.users.dependencies import get_curr_user_id


o_router = APIRouter(prefix='/orders', tags=['Orders'])
c_router = APIRouter(prefix='/cart', tags=['Cart'])

@c_router.get('/get/')
async def get_cart(user_id: int = Depends(get_curr_user_id)) -> List[SCartItemResponse]:
    return await UserProductItemDAO.get_cart(user_id=user_id)


@c_router.post('/add/')
async def add_to_cart(product_type_art: int, 
                      quantity: int = 1, 
                      user_id: int = Depends(get_curr_user_id)):
    await UserProductItemDAO.add_to_cart(user_id=user_id, 
                                         product_type_art=product_type_art,
                                         quantity=quantity)
    return {'Message':f'Item with art {product_type_art} added to cart!'}


@c_router.delete('/remove/')
async def remove_from_cart(product_type_art: int,
                           user_id: int = Depends(get_curr_user_id)):
    await UserProductItemDAO.remove_from_cart(user_id=user_id,
                                              product_type_art=product_type_art)
    return {'message':f'Item with art {product_type_art} removed from cart!'}


@o_router.post('/create/')
async def create_order(user_id: int = Depends(get_curr_user_id)):
    try:
        return await UserProductItemDAO.create_order_from_cart(user_id=user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@o_router.get('/get/')
async def get_curr_user_orders(user_id: int = Depends(get_curr_user_id)
                               ):
    return await UserProductItemDAO.get_user_orders(user_id=user_id)


@o_router.delete('/delete/{order_id}')
async def delete_order_by_id(order_id: int, user_id:int = Depends(get_curr_user_id)):
    check = await UserProductItemDAO.delete_order(order_id=order_id, user_id=user_id)
    if check:
        return {'message':f'Order with ID {order_id} successfully deleted!'}
    else:
        return {'message':f'Error while deleting order with ID {order_id}'}