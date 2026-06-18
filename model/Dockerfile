FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE ${MODEL_PORT}

CMD ["sh", "-c", "\
    if [ \"$DEPLOY_MODE\" = 'production' ]; then \
        gunicorn main:app \
            -k uvicorn.workers.UvicornWorker \
            -w $(nproc) \
            -b 0.0.0.0:${MODEL_PORT} \
            --timeout 120; \
    else \
        uvicorn main:app \
            --host 0.0.0.0 \
            --port ${MODEL_PORT} \
            --reload; \
    fi"]