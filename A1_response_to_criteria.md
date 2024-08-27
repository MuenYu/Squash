Assignment 1 - Web Server - Response to Criteria
================================================

Overview
------------------------------------------------

- **Name:** Muen Yu
- **Student number:** n11457571
- **Application name:** Squash
- **Two line description:** Squash is a video compression platform.
It can compress the video users uploaded and keep the compression history for different users.


Core criteria
------------------------------------------------ 

### Docker image

- **ECR Repository name:** n11457571/assess1
- **Video timestamp:** 0:05
- **Relevant files:**
    - /Dockerfile


### Docker image running on EC2

- **EC2 instance ID:** i-0b11695d6530ad679
- **Video timestamp:** 0:20

### User login functionality

- **One line description:** Hard-coded username/password in map. using JWTs for sessions.
- **Video timestamp:** 0:26
- **Relevant files:**
    - /api/controller/userController.js
    - /api/utils/jwt.js

### User dependent functionality

- **One line description:** Show user compression history including source file, compression finished time, compression level and download link.
- **Video timestamp:** 1:00
- **Relevant files:**
    - /api/controller/videoController.js 14,21


### Web client

- **One line description:** a react + react-router page with daisyui style
- **Video timestamp:** 1:15
- **Relevant files:**
    - /web/
    - /api/app.js 35,42

### REST API

- **One line description:** REST API with endpoints (as nouns) and HTTP methods (GET, POST), and appropriate status codes
- **Video timestamp:** 1:23
- **Relevant files:**
    - /api/routes/
    - /api/controller/

### Two kinds of data

#### First kind

- **One line description:** Video files user uploaded and compressed
- **Type:** Unstructured
- **Rationale:** Videos are too large for database. No need for additional functionality
- **Video timestamp:** 2:37
- **Relevant files:**
    - /api/routes/video.js 14,24;28
    - /api/controller/videoController.js 49,53
    - /api/upload/
    - /api/output/

#### Second kind

- **One line description:** user ownership of videos
- **Type:** Structured, no ACID requirements
- **Rationale:** Need to be able to query but no chance to modify
- **Video timestamp:** 2:52
- **Relevant files:**
  - /api/routes/video.js 14,24;28
  - /api/controller/videoController.js 14,21;55,60;85,92;

### CPU intensive task

- **One line description:** Video compression through ffmpeg
- **Video timestamp:** 3:05
- **Relevant files:**
    - /api/routes/video.js 28
    - /api/controller/videoController.js 68,99

### CPU load testing method

- **One line description:** sending request to init compression tasks through a JavaScript script
- **Video timestamp:** 3:33
- **Relevant files:**
    - /runner/tester.js
    - /runner/sample_lg.mp4
    - /runner/sample.mp4

Additional criteria
------------------------------------------------

### Extensive REST API features

- **One line description:** Fix CORS issue, so the api can be called through different clients
- **Video timestamp:** 4:18
- **Relevant files:**
    - /api/app.js 33


### Use of external API(s)

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 


### Extensive web client features

- **One line description:** react SPA with dark mode
- **Video timestamp:** 4:36
- **Relevant files:**
    - /web/components/ThemeToggle.jsx


### Sophisticated data visualisations

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 


### Additional kinds of data

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 


### Significant custom processing

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 


### Live progress indication

- **One line description:** display the current progress through polling requests
- **Video timestamp:** 1:55
- **Relevant files:**
    - /api/routers/video.js 30
    - /api/controllers/videoController 9;23,30


### Infrastructure as code

- **One line description:** I use docker-compose to deploy the project
- **Video timestamp:** 4:45
- **Relevant files:**
    - /compose.yml


### Other

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
    - 
