import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// Configuration
const API_BASE_URL = process.argv[2] ?? 'http://localhost:3000'; // Replace with your API base URL
const username = 'user1';
const password = 'user1';
const videoFilePath = './sample.mp4'; // Replace with your video file path
const compressionLevel = 28;

// Function to log in and retrieve JWT
async function login() {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
            username,
            password,
        });
        return response.data.token;
    } catch (error) {
        console.error('Error logging in:', error.message);
        process.exit(1);
    }
}

// Function to upload the video and get taskID
async function compressVideo(jwt) {
    try {
        const form = new FormData();
        form.append('videoFile', fs.createReadStream(videoFilePath));
        form.append('level', compressionLevel);

        const response = await axios.post(`${API_BASE_URL}/api/videos/compress`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${jwt}`,
            },
        });

        return response.data.taskId;
    } catch (error) {
        console.error('Error uploading video:', error.message);
        process.exit(1);
    }
}

// Function to check the progress of the video compression
async function checkProgress(jwt, taskID) {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/videos/progress/${taskID}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        return response.data.progress;
    } catch (error) {
        console.error('Error checking progress:', error.message);
        process.exit(1);
    }
}

// Main function to execute the steps
async function main() {
    try {
        console.log('Logging in...');
        const jwt = await login();
        console.log('JWT obtained:', jwt);

        for (let i = 1; ; ++i) {
            console.log(`Round ${i}: Uploading video...`);
            const taskID = await compressVideo(jwt);
            console.log(`Round ${i}: Video uploaded, task ID: ${taskID}`);

            let progress = 0;
            while (progress < 100) {
                progress = await checkProgress(jwt, taskID);
                console.log(`Round ${i} Progress: ${progress}%`);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            console.log(`Round ${i} done!\n`);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

// Run the script
main();
