# Squash
## Introduction
// A project introduction 2-3 sentences
// The project is not production ready
// core functionalities in bullet points

## Architect
// introduce how the project is architected, including all components, dependency services, etc. 5-10 sentences

## Local Run
### Preparation
- Node 20+
- Make
- Docker

### Steps
1. create your own `.env` file according to [env.example](./env.example)
2. run `make run-local`, it will run all dependencies and services
3. run `npm install` in root dir, to install prisma for db filling.
4. fill db with `make init-db`, to generate db schema in db.

## Development
You can run all dependencies in containers and the app locally for development purpose.  
Run all dependencies: `make run-dep`, you can also check more useful CMDs in the [Makefile](./Makefile).

It's a monorepo, for more specific and detailed info, please check:

- web: [web/README.md](./web/README.md)
- worker: [worker/README.md](./worker/README.md)
- prisma: [prisma/README.md](./prisma/README.md)


## TODO
- [ ] CI: Unit Test (any branch)
- [ ] CI: Integration Test (feature branch)
- [ ] CI: End to End Test (master branch)
- [ ] CD: Automated container build (master branch)
