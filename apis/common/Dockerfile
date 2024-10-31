FROM node:lts-alpine

WORKDIR /app
COPY shared ./shared
COPY common ./common

RUN cd shared && \
    npm i && \
    cd ../common && \
    npm i

ENTRYPOINT ["node", "common/app.js"]