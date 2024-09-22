import mongoose from "mongoose";
import { getSecret } from "./secretmanager.js";
import axios from "axios"
import { writeFile } from 'fs/promises';
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

    const response = await axios.get(certUrl);

    if (response.status !== 200) {
        throw new Error(`Failed to fetch certificate: ${response.statusText}`);
    }

    return new Promise((resolve, reject) => {
        writeFile(filePath, response.data)
            .then(() => {
                console.log('Certificate downloaded successfully:', filePath);
                resolve();
            }).catch((err) => {
                console.error('Error writing certificate file:', err);
                reject(err);
            })
    })
}

export async function resetMongo() {
    await Video.collection.drop();
    await mongoose.disconnect();
    console.log("mongo reset success")
}