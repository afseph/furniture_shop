from dao.base import BaseDAO
from app.products.models import Product, Category

class ProductDAO(BaseDAO):
    model = Product

class CategoryDAO(BaseDAO):
    model = Category