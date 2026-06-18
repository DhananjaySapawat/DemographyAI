FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE ${BACKEND_PORT}

CMD ["sh", "-c", "\
    if [ \"$DEPLOY_MODE\" = 'production' ]; then \
        gunicorn app.main:app \
            -k uvicorn.workers.UvicornWorker \
            -w $(nproc) \
            -b 0.0.0.0:${BACKEND_PORT} \
            --timeout 120; \
    else \
        uvicorn app.main:app \
            --host 0.0.0.0 \
            --port ${BACKEND_PORT} \
            --reload; \
    fi"]