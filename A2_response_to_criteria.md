Assignment 1 - Web Server - Response to Criteria
================================================

Instructions
------------------------------------------------
- Keep this file named A2_response_to_criteria.md, do not change the name
- Upload this file along with your code in the root directory of your project
- Upload this file in the current Markdown format (.md extension)
- Do not delete or rearrange sections.  If you did not attempt a criterion, leave it blank
- Text inside [ ] like [eg. S3 ] are examples and should be removed


Overview
------------------------------------------------

- **Name:** Muen Yu
- **Student number:** N11457571
- **Partner name (if applicable):** Keisuke Tarusawa
- **Application name:** Squash
- **Two line description:**  Squash is a video compression platform.
It can compress the video users uploaded and keep the compression history for different users.
- **EC2 instance name or ID:** i-0930b8e94366c0e20

Core criteria
------------------------------------------------

### Core - First data persistence service

- **AWS service name:**  S3
- **What data is being stored?:** user-uploaded and compressed videos
- **Why is this service suited to this data?:** large files are best suited to blob storage due to size restrictions on other services
- **Why is are the other services used not suitable for this data?:** 
Other data storage services may lack the scalability, durability, and low-latency retrieval that Amazon S3 provides, making them less ideal for storing and serving large video files efficiently.
- **Bucket/instance/table name:** squash-assess2
- **Video timestamp:** 03:05
- **Relevant files:**
    - /api/util/s3.js
    - /api/controller/videoController.js

### Core - Second data persistence service

- **AWS service name:**  RDS
- **What data is being stored?:** video compress history
- **Why is this service suited to this data?:** RDS is ideal for storing compressed historical data because it provides managed relational database capabilities, ensuring data integrity, easy querying, and automated backups in a scalable and reliable environment.
- **Why is are the other services used not suitable for this data?:** Other services may lack the relational structure, strong consistency, or efficient query capabilities needed for complex historical data analysis and management.
- **Video timestamp:** 03:50
- **Relevant files:**
    - /api/util/rds.js
    - /api/controller/videoController.js

### Third data service

- **AWS service name:**  documentdb
- **What data is being stored?:** video compression metadata
- **Why is this service suited to this data?:** DocumentDB is well-suited for storing compression metadata because it efficiently handles semi-structured data, scales seamlessly, and provides flexible querying for document-based data models.
- **Why is are the other services used not suitable for this data?:** Other services may not offer the same performance or flexibility when managing complex, nested metadata structures or lack the optimized handling of semi-structured data.
- **Video timestamp:** 04:25
- **Relevant files:**
    - /api/util/mongo.js
    - /api/controller/videoController.js

### S3 Pre-signed URLs

- **S3 Bucket names:** squash-assess2
- **Video timestamp:** 04:50
- **Relevant files:**
    - /api/util/s3.js
    - /api/controller/videoController.js

### In-memory cache

- **ElastiCache instance name:** squash-assess2
- **What data is being cached?:** compression real-time progress
- **Why is this data likely to be accessed frequently?:** the client will send polling requests to get the progress data, and the progress will also be written by the server side
- **Video timestamp:** 05:00
- **Relevant files:**
    - /api/utils/memcache.js
    - /api/controller/videoController.js

### Core - Statelessness

- **What data is stored within your application that is not stored in cloud data services?:** intermediate videos during compression
- **Why is this data not considered persistent state?:** they can be regenerated when launching a task
- **How does your application ensure data consistency if the app suddenly stops?:** the application will ensure the task is done and then store the data to database. Otherwise, the task will be dropped and no data will be recorded.
- **Relevant files:**
    - /api/utils/videoController.js

### Graceful handling of persistent connections

- **Type of persistent connection and use:** [eg. server-side-events for progress reporting]
- **Method for handling lost connections:** [eg. client responds to lost connection by reconnecting and indicating loss of connection to user until connection is re-established ]
- **Relevant files:**
    -


### Core - Authentication with Cognito

- **User pool name:** squash-assess2
- **How are authentication tokens handled by the client?:** Authentication tokens are handled by storing them in the browser's localStorage after a successful login.
- **Video timestamp:** 00:25
- **Relevant files:**
    - /api/controller/userController.js: 23, 43, 64
    - /api/middleware/auth.js

### Cognito multi-factor authentication

- **What factors are used for authentication:** TOTP provided by Google Authenticator app
- **Video timestamp:** 01:27
- **Relevant files:**
    - /api/controller/userController.js: 64, 100, 115, 142

### Cognito federated identities

- **Identity providers used:** Google
- **Video timestamp:** 01:55
- **Relevant files:**
    - /api/controller/userController.js: 170, 208

### Cognito groups

- **How are groups used to set permissions?:** [eg. 'admin' users can delete and ban other users]
- **Video timestamp:**
- **Relevant files:**
    -

### Core - DNS with Route53

- **Subdomain**:  squash.cab432.com
- **Video timestamp:** 00:15


### Custom security groups

- **Security group names:** SquashAss2AppSG, SquashAss2DBSG
- **Services/instances using security groups:** SquashAss2AppSG for EC2, SquashAss2DBSG for RDS, ElastiCache and documentdb
- **Video timestamp:** 05:43
- **Relevant files:**
    - /deploy/cloudformation.yaml

### Parameter store

- **Parameter names:** /assess2/squash/port, /assess2/squash/redirect_uri & /assess2/squash/s3
- **Video timestamp:** 06:05
- **Relevant files:**
    - /api/utils/parameterstore.js

### Secrets manager

- **Secrets names:** /assess2/squash/secret
- **Video timestamp:** 06:25
- **Relevant files:**
    - /api/utils/secretmanager.js

### Infrastructure as code

- **Technology used:** cloudformation
- **Services deployed:** EC2, DocumentDB, RDS, ElastiCache and cognito
- **Video timestamp:** 06:45
- **Relevant files:**
    - /api/utils/cloudformation.yaml

### Other (with prior approval only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior permission only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -