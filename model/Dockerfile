FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 9000

CMD ["gunicorn","main:app","-k","uvicorn.workers.UvicornWorker","-w","2","-b","0.0.0.0:9000"]