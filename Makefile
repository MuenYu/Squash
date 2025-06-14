DEP_FILE = dependency.yaml

# run all dependencies
run-dep:
	docker compose -f $(DEP_FILE) up -d

# stop all dependencies
stop-dep:
	docker compose -f $(DEP_FILE) down

# stop all dependencies and reset app
clean-dep:
	docker compose -f $(DEP_FILE) down -v

# initiate db
init-db:
	npx prisma migrate dev --name init

gen-db:
	npx prisma generate