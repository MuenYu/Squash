import mongoose from "mongoose";
import { getSecret } from "./secretmanager.js";
import { downloadCert } from "./cert.js";

const key = "mongodb";

export async function connectMongo() {
    await downloadCert();
    let url = await getSecret(key);
    await mongoose.connect(url);
}
