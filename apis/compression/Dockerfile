FROM node:lts-alpine

WORKDIR /app
RUN apk add --no-cache ffmpeg

COPY shared ./shared
COPY compression ./compression

RUN cd shared && \
    npm i && \
    cd ../compression && \
    npm i

ENTRYPOINT ["node", "compression/app.js"]