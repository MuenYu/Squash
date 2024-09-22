// a script to remove all data from database
import { connectMongo, resetMongo } from "./utils/mongo.js";
import { resetRDS } from "./utils/rds.js";
import { resetS3 } from "./utils/s3.js";

try {
    await connectMongo();
    await resetMongo();
    await resetRDS();
    await resetS3();
} catch(err) {
    console.error(err)
}