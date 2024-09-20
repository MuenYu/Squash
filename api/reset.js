// a script to remove all data from database
import { connectMongo, resetMongo } from "./utils/mongo.js";

try {
    await connectMongo();
    await resetMongo();
} catch(err) {
    console.error(err)
}