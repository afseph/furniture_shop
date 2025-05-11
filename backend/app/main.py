from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.products.router import router as router_students
from app.users.router import router as router_users
from app.orders_cart.router import c_router as router_cart
from app.orders_cart.router import o_router as router_order


tags_metadata = [
    {
        'name':'Product Types',
        'description':'Секция отвечающая за товары.'
    },
    {
        'name':'Product Groups',
        'description':'Секция отвечающая за товарные группы.'
    },
    {
        'name':'Categories',
        'description':'Секция отвечающая за категории.'
    },
    {
        'name':'Product Characteristics',
        'description':'Секция отвечающая за характеристики товаров.'
    }
]

app = FastAPI(openapi_tags=tags_metadata)

origins = [
    'http://localhost:3000',
    'http://localhost',
    'http://87.228.76.116'
]

app.add_middleware(
    # сначапо все запрещаем    
    CORSMiddleware,
    # потом начинаем разрешать необходимое
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home_page():
    return {"message": "Hello WRLD!"}


app.include_router(router_users)
app.include_router(router_students)
app.include_router(router_cart)
app.include_router(router_order)