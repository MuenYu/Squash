# CAB432 assessment2
An online video compression platform, which allows user to upload their video, and choose the compression level they want

Check the functionalities here: [criteria](./A2_response_to_criteria.md)

## Env
### api
The api module should be run on EC2 instance to get all necessary permissions and access to AWS services. You need to create the env file `/api/.env.dev`, following the format below:

```properties
AWS_REGION=ap-southeast-2
PARAMETER_STORE_PORT=/assess2/squash/port
PARAMETER_STORE_MAXSIZE=/assess2/squash/upload_maxsize
PARAMETER_STORE_S3BUCKET=/assess2/squash/s3_bucket
SECRET_MANAGER_NAME=/assess2/squash/secrets
```

## web
Configure the backend api. Otherwise, it will set `/api` as the api path.
```
VITE_API=http://13.211.191.44:3000/api
```
