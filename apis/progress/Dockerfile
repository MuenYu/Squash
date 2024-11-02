FROM node:lts-alpine

WORKDIR /app
COPY shared ./shared
COPY progress ./progress

RUN cd shared && \
    npm i && \
    cd ../progress && \
    npm i

ENTRYPOINT ["node", "progress/app.js"]