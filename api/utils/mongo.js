import mongoose from "mongoose";
import { getSecret } from "./secretmanager.js";
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { join } from 'path';
import Video from "../model/video.js";

const key = "mongodb";
const certUrl = "https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem";

export async function connectMongo() {
    await downloadCert();
    const url = await getSecret(key);
    await mongoose.connect(url);
    console.log(`mongodb init success`)
}

async function downloadCert() {
    const filePath = join(process.cwd(), 'global-bundle.pem'); // Save in the root of the project

    const response = await fetch(certUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch certificate: ${response.statusText}`);
    }

    return new Promise((resolve,reject) => {
        // Create a write stream to save the file
        const fileStream = createWriteStream(filePath);

        // Pipe the downloaded file into the stream
        response.body.pipe(fileStream);

        // Return a promise that resolves when the file has finished writing
        fileStream.on('finish', () => {
            console.log('Certificate downloaded successfully:', filePath);
            resolve();
        });

        fileStream.on('error', (err) => {
            console.error('Error writing certificate file:', err);
            reject(err);
        });
    })
}

export async function resetMongo() {
    await Video.collection.drop();
    await mongoose.disconnect();
    console.log("mongo reset success")
}