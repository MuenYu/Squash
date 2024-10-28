DEP_FILE = dependency.yaml

# run all dependencies
run-dep:
	sudo docker compose -f $(DEP_FILE) up -d

# stop all dependencies
stop-dep:
	sudo docker compose -f $(DEP_FILE) down

# stop all dependencies and reset app
clean-dep:
	sudo docker compose -f $(DEP_FILE) down -v

aws-sso:
	aws sso login