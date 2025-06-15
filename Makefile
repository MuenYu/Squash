DEP_COMPOSE = dependency.yaml
LOCAL_COMPOSE = localrun.yaml

# run all dependencies
run-dep:
	docker compose -f $(DEP_COMPOSE) up -d

# stop all dependencies and clean all data
stop-dep:
	docker compose -f $(DEP_COMPOSE) down -v

# initiate db
init-db:
	npx prisma migrate dev --name init

gen-db:
	npx prisma generate

# reset dev environment, sleep is for waiting for db launching
reset:
	make stop-dep
	make clean-dep
	make run-dep
	sleep 2
	make init-db

# build worker image
build-worker:
	docker build -t worker:latest -f worker/Dockerfile .

# run services locally
run-local:
	docker compose -f $(LOCAL_COMPOSE) up -d

# stop services and clean all data
stop-local:
	docker compose -f $(LOCAL_COMPOSE) down -v
