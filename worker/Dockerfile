FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma/. ./prisma

RUN npm install && \
    npx prisma generate

# ------------------------------
# Build stage
# ------------------------------

FROM node:lts-alpine


# Set working directory
WORKDIR /app

COPY --from=builder /app/worker/generated/. ./generated

# Install ffmpeg
RUN apk add --no-cache ffmpeg

# Copy package files first (for better caching)
COPY worker/package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY worker/. ./

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "start"]
