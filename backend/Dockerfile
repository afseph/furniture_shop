FROM python:3.12-slim

# Netcat нужен для работы скрипта
RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

COPY requirements.txt /app

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY . /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]