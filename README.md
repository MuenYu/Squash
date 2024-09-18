# CAB432 assessment2
An online video compression platform, which allows user to upload their video, and choose the compression level they want

Check the functionalities here: [criteria](./A2_response_to_criteria.md)

## Env
### api
**It's temporary solution!! It will be replaced by parameter manager/secret manager**
The api module should be run on EC2 instance to get all necessary permissions and access to AWS services. You need to create the env file `/api/.env.dev`, following the format below:

```
PORT=3000
TOKEN_SECRET=6CfVaNSaHLzOp545zlh6
TOKEN_EXPIRATION=30d
UPLOAD_MAXSIZE=52428800
MONGODB_URI=mongodb://localhost:27017
```

## web
Configure the backend api. Otherwise, it will set `/api` as the api path.
```
VITE_API=http://13.211.191.44:3000/api
```
