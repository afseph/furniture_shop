FROM python:3.12-slim

# Netcat нужен для работы скрипта
RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Установка прав на выполнение комманды
RUN chmod +x /app/start.sh

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]