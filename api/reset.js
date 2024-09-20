// a script to remove all data from database
import { connectMongo, resetMongo } from "./utils/mongo.js";
import { resetRDS } from "./utils/rds.js";

try {
    await connectMongo();
    await resetMongo();
    await resetRDS();
} catch(err) {
    console.error(err)
}