# Configurations
Environmental Variable always has the highest priority.

| Config Name | Explanation | Configurable Files |
| --- | --- | --- |
| s3 | s3 bucket name | `.env`, `parameter store` |
| rds | rds url string | `.env`, `secret manager` |
| memcache | memcache url string | `.env`, `parameter store` |
| userPoolId | user pool id for cognito | `.env`, `parameter store` |
| clientId | client id for cognito | `.env`, `parameter store` |
| sqsUrl | url for SQS | `.env`, `parameter store` |
