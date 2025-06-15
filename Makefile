DEP_COMPOSE = dependency.yaml
LOCAL_COMPOSE = localrun.yaml

# run all dependencies
run-dep:
	docker compose -f $(DEP_COMPOSE) up -d

# stop all dependencies
stop-dep:
	docker compose -f $(DEP_COMPOSE) down

# initiate db
init-db:
	npx prisma migrate dev --name init

# generate prisma client in web & worker
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

# build worker image
build-web:
	docker build -t web:latest -f web/Dockerfile .

# run services locally
run-local:
	docker compose -f $(LOCAL_COMPOSE) up -d
	sleep 2
	make init-db

# stop services and clean all data
stop-local:
	docker compose -f $(LOCAL_COMPOSE) down -v
