from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.orders_cart.dao import UserProductItemDAO
from app.orders_cart.schemas import SOrderItemResponse, SOrderResponse, SCartItemResponse

from app.users.dependencies import get_curr_user_id, get_current_admin_user


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


@o_router.delete('/cancel/{order_id}')
async def delete_order_by_id(order_id: int, user_id:int = Depends(get_curr_user_id)):
    check = await UserProductItemDAO.delete_order(order_id=order_id, user_id=user_id)
    if check:
        return {'message':f'Order with ID {order_id} successfully deleted!'}
    else:
        return {'message':f'Error while deleting order with ID {order_id}'}
    

# ! ADMIN ENDPOINTS

@o_router.get('/admin/all/')
async def get_all_orders(is_adm: int = Depends(get_current_admin_user)
                               ):
    return await UserProductItemDAO.get_all_orders()


@o_router.delete('/admin/delete/{order_id}')
async def delete_order_by_id(order_id: int,
                             is_adm: int = Depends(get_current_admin_user)):
    try:
        return await UserProductItemDAO.admin_delete_order(order_id=order_id)
    except:
        return HTTPException(status_code=status.HTTP_409_CONFLICT,
                             detail={'message':'''Order id already deleted or 
                             doesnt exists'''})


@o_router.put('/admin/update/status/{order_id}')
async def edit_order_status_by_id(order_id: int,
                                  new_status: str,
                             is_adm: int = Depends(get_current_admin_user)):
    try:
        return await UserProductItemDAO.admin_update_order_status(order_id=order_id,
                                                                  new_status=new_status)
    except:
        return HTTPException(status_code=status.HTTP_409_CONFLICT,
                             detail={'message':'''Order id already deleted or 
                             doesnt exists'''})