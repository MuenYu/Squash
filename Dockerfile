# Step 1: Build the React frontend
FROM node:lts-alpine AS builder
WORKDIR /app
COPY web/package.json web/package-lock.json ./
RUN npm install
COPY web/ ./
RUN npm run build

# Step 2: Set up the Express backend
FROM node:lts-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app
COPY api/package.json api/package-lock.json ./
RUN npm install
COPY api/ ./

# Copy the React build from the builder stage to the backend
COPY --from=builder /app/dist ./public

# ENV
ENV PORT=3000
ENV TOKEN_SECRET=6CfVaNSaHLzOp545zlh6
ENV TOKEN_EXPIRATION=30d
ENV UPLOAD_MAXSIZE=52428800
ENV MONGODB_URI=mongodb://localhost:27017

EXPOSE $PORT

ENTRYPOINT ["node", "app.js"]