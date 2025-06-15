# Squash
## Introduction
Squash is a modern monorepo project template that provides a streamlined development experience with integrated web, worker, and database components. While currently in active development and not yet production-ready, it offers a solid foundation for building scalable applications.

Core Features:
- Monorepo architecture with TypeScript support
- Integrated web frontend and background worker services
- Prisma-based database management and migrations
- Docker-based local development environment
- Comprehensive development tooling with Make

## Architecture
### Overall Architecture
A microservices-based system with three core components - web frontend, background worker, and shared database. Services communicate via message queues and operate in containerized environments for optimal isolation and scalability.

### Technology Stack
- **Frontend**: Next.js, React, TypeScript, TailwindCSS, DaisyUI
- **Backend**: Next.js API Routes, Node.js
- **Authentication**: NextAuth.js with Google OAuth
- **Worker**: Node.js background processing with BullMQ
- **Database**: PostgreSQL with Prisma ORM
- **Message Queue**: Redis (BullMQ)
- **Object Storage**: MinIO
- **Video Processing**: FFmpeg
- **Infrastructure**: Docker, Docker Compose
- **Development**: Make, npm, TypeScript

## Local Run
### Prerequisites
- Node.js 20 or higher
- Make build tool
- Docker Engine

### Setup Steps
1. Create your own `.env` file by copying and configuring [env.example](./env.example)
2. Launch all services with `make run-local`
3. Install dependencies with `npm install` in the project root
4. Initialize the database schema with `make init-db`

## Development
### Dependencies
You can run all dependencies in containers and the app locally for development purpose.  
Run all dependencies: `make run-dep`, you can also check more useful CMDs in the [Makefile](./Makefile).

### Project Structure
```md
Squash/
├── .github/                    # GitHub templates and workflows
│   └── ISSUE_TEMPLATE/         # Issue and feature request templates
├── prisma/                     # Database schema and migrations
│   ├── migrations/             # Database migration files
│   ├── schema.prisma          # Prisma schema definition
│   └── README.md              # Database setup documentation
├── web/                        # Next.js frontend application
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── api/           # API routes
│   │   │   ├── login/         # Authentication pages
│   │   │   └── panel/         # Main application dashboard
│   │   ├── components/        # Reusable React components
│   │   ├── lib/               # Utility libraries (Redis, MinIO, etc.)
│   │   └── auth.ts            # NextAuth.js configuration
│   ├── generated/             # Auto-generated Prisma client
│   ├── public/                # Static assets
│   ├── Dockerfile             # Web service container
│   └── package.json           # Frontend dependencies
├── worker/                     # Background job processor
│   ├── src/
│   │   ├── lib/               # Worker utilities (compression, storage)
│   │   └── index.ts           # Main worker process
│   ├── generated/             # Auto-generated Prisma client
│   ├── Dockerfile             # Worker service container
│   └── package.json           # Worker dependencies
├── video4test/                 # Sample video files for testing
├── dependency.yaml             # Development dependencies (Docker Compose)
├── localrun.yaml              # Full local environment (Docker Compose)
├── Makefile                   # Development automation commands
├── package.json               # Root project configuration
└── README.md                  # Project documentation
```


### More Details
For more specific and detailed info, please check:

- web: [web/README.md](./web/README.md)
- worker: [worker/README.md](./worker/README.md)
- prisma: [prisma/README.md](./prisma/README.md)

## TODO
- [ ] CI: Unit Test (any branch)
- [ ] CI: Integration Test (feature branch)
- [ ] CI: End to End Test (master branch)
- [ ] CD: Automated container build (master branch)
