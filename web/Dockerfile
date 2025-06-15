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

WORKDIR /app

COPY --from=builder /app/web/generated/. ./generated

# Copy package files first (for better caching)
COPY web/package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY web/. ./

# Start the application
CMD ["npm", "run", "dev"]
