# Squash Web Frontend

The Next.js frontend application for Squash - a video compression platform with real-time progress tracking and user authentication.


## Getting Started

### Prerequisites
- Node.js 20 or higher
- Running dependencies (PostgreSQL, Redis, MinIO)
- Google OAuth credentials

### Environment Setup
1. Copy the environment template:
   ```bash
   cp env.example .env
   ```
2. Configure your .env file with according to [env.example](/web/env.example)

### Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application

### Production
1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm run start
   ```

## Build & Deployment
```bash
# Production build
npm run build

# Start production server
npm start

# Docker build (from project root)
make build-web
```

## Important Notes
### File Upload Limits
- Maximum file size: 50MB (configured in next.config.ts )
- Supported formats: All video types ( video/* )
### Real-time Updates
- Progress tracking polls /api/progress/[id] every second
- Progress data is stored in Redis cache
- Automatic redirect to completion page at 100%
### Database Integration
- Prisma client is auto-generated to generated/prisma/
- Separate client generation for web and worker services
- Database records track compression history per user