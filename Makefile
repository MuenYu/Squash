DEP_FILE = dependency.yaml
SRV_FILE = localrun.yaml
DOCKERHUB_USER = parasomnia
DOCKER_CONTEXT = ./apis

# run all dependencies
run-dep:
	sudo docker compose -f $(DEP_FILE) up -d

# stop all dependencies
stop-dep:
	sudo docker compose -f $(DEP_FILE) down

# stop all dependencies and reset app
clean-dep:
	sudo docker compose -f $(DEP_FILE) down -v

# login to aws
aws-sso:
	aws sso login

# login to dockerhub
hub-sso:
	sudo docker login

# run all micro services locally
run-local:
	sudo docker compose -f $(SRV_FILE) up

stop-local:
	sudo docker compose -f $(SRV_FILE) down

# build auth docker image
build-auth:
	sudo docker build -f $(DOCKER_CONTEXT)/auth/Dockerfile -t $(DOCKERHUB_USER)/squash_auth:latest $(DOCKER_CONTEXT)

# push auth to docker hub
push-auth:
	sudo docker push $(DOCKERHUB_USER)/squash_auth:latest

# build common docker image
build-common:
	sudo docker build -f $(DOCKER_CONTEXT)/common/Dockerfile -t $(DOCKERHUB_USER)/squash_common:latest $(DOCKER_CONTEXT)

# push common to docker hub
push-common:
	sudo docker push $(DOCKERHUB_USER)/squash_common:latest

# build common docker image
build-compression:
	sudo docker build -f $(DOCKER_CONTEXT)/compression/Dockerfile -t $(DOCKERHUB_USER)/squash_compression:latest $(DOCKER_CONTEXT)

# push common to docker hub
push-compression:
	sudo docker push $(DOCKERHUB_USER)/squash_compression:latest