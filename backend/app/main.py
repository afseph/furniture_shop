from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.products.router import router as router_students
from app.users.router import router as router_users
from app.pages.router import router as router_pages


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


@app.get("/")
def home_page():
    return {"message": "Hello WRLD!"}

app.mount('/static', StaticFiles(directory='app/static'), 'static')

app.include_router(router_users)
app.include_router(router_students)
app.include_router(router_pages)