FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

RUN if [ "$DEPLOY_MODE" = "production" ]; then npm run build; fi

EXPOSE ${FRONTEND_PORT}

CMD ["sh", "-c", "\
    if [ \"$DEPLOY_MODE\" = 'production' ]; then \
        npm start -- -p ${FRONTEND_PORT}; \
    else \
        npm run dev -- -p ${FRONTEND_PORT}; \
    fi"]