# Worker

The Worker component is a crucial part of the Squash project that handles background job processing and asynchronous tasks. It is built using Node.js and integrates with message queues to ensure reliable task execution and scalability. The Worker service processes various operations like data aggregation, notifications, and scheduled maintenance tasks.

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- Docker

### Environment Setup
1. Copy `.env.example` to `.env` and configure environment variables
2. Install dependencies: `npm i` in the worker dir
3. Start the worker service: `npm run dev` in the worker dir

## Build
```bash
# in the root dif
make build-worker
```