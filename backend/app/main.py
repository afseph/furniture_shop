from fastapi import FastAPI
from app.products.router import router as router_students


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
    }
]

app = FastAPI(openapi_tags=tags_metadata)


@app.get("/")
def home_page():
    return {"message": "Привет, Хабр!"}


app.include_router(router_students)