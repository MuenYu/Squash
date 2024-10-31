FROM node:lts-alpine

WORKDIR /app
COPY shared ./shared
COPY auth ./auth

RUN cd shared && \
    npm i && \
    cd ../auth && \
    npm i

ENTRYPOINT ["node", "auth/app.js"]