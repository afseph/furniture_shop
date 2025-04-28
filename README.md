# Mebel Store
Программа для дипломного проекта: "Разработка интернет магазина мебели"

## Стек технологий:
[![My Skills](https://skillicons.dev/icons?i=python,fastapi,js,react,postgres,docker)](https://skillicons.dev)

## Для запуска проекта:
  - windows
```
docker-compose up --build
```
 - -(unix) systems
```
docker compose up --build
```

## Доступные команды администрирования
В директории Backend вы можете использовать:

### `python manage.py createsuperuser`
Для создания суперпользователя.

### `python manage.py populate_db`
Для популяции БД тестовыми данными.

### `python manage.py clear_db`
Для полной очистки БД (таблица пользователей не очищается!).