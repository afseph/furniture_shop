#!/bin/bash

echo "Ждём БД..."
while ! nc -z db 5432; do
  sleep 1
done

echo "БД доступна. Генерируем миграцию."
# Уникальное имя ревизии по дате
REVISION_MSG="auto_$(date +%Y%m%d_%H%M%S)"
alembic revision --autogenerate -m "$REVISION_MSG"

echo "Применяем миграции."
alembic upgrade head

echo "Запускаем FastAPI."
uvicorn app.main:app --host 0.0.0.0 --port 80