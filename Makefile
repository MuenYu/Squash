DEP_FILE = dependency.yaml
SRV_FILE = localrun.yaml
REPO = 901444280953.dkr.ecr.ap-southeast-2.amazonaws.com/squash
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

# run all micro services locally
run-local:
	sudo docker compose -f $(SRV_FILE) up -d
	sudo service nginx start

stop-local:
	sudo docker compose -f $(SRV_FILE) down
	sudo service nginx stop

# build auth docker image
build-auth:
	sudo docker build -f $(DOCKER_CONTEXT)/auth/Dockerfile -t $(REPO)/auth:latest $(DOCKER_CONTEXT)

# push auth to docker hub
push-auth:
	sudo docker push $(REPO)/auth:latest

# build common docker image
build-common:
	sudo docker build -f $(DOCKER_CONTEXT)/common/Dockerfile -t $(REPO)/common:latest $(DOCKER_CONTEXT)

# push common to docker hub
push-common:
	sudo docker push $(REPO)/common:latest

# build common docker image
build-compression:
	sudo docker build -f $(DOCKER_CONTEXT)/compression/Dockerfile -t $(REPO)/compression:latest $(DOCKER_CONTEXT)

# push common to docker hub
push-compression:
	sudo docker push $(REPO)/compression:latest

# build progress to docker hub
build-progress:
	sudo docker build -f $(DOCKER_CONTEXT)/progress/Dockerfile -t $(REPO)/progress:latest $(DOCKER_CONTEXT)

# push progress to docker hub
push-progress:
	sudo docker push $(REPO)/progress:latest

# build all images
build-all:
	make build-auth
	make build-common
	make build-compression
	make build-progress

# push all images
push-all:
	make push-auth
	make push-common
	make push-compression
	make push-progress

update-cf:
	aws s3 cp cloudformation.yaml s3://n11457571-assess2-cloudformation/cloudformation.yaml

ecr-sso:
	aws ecr get-login-password --region ap-southeast-2 | sudo docker login --username AWS --password-stdin 901444280953.dkr.ecr.ap-southeast-2.amazonaws.com