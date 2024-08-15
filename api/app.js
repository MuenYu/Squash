import express from "express";
import user from "./routes/user.js";
import video from "./routes/video.js";
import { createPathIfNotExist } from "./utils/path.js";
import cors from "cors";
import { errHandler } from "./middleware/err.js";
import mongoose from "mongoose";

// app conf
const port = process.env.PORT || 3000;
const uploadPath = process.env.UPLOAD_PATH;
const outputPath = process.env.OUTPUT_PATH;
const mongoDB = process.env.MONGODB_URI;

// create folders for upload and output if not exist
createPathIfNotExist(uploadPath);
createPathIfNotExist(outputPath);

// db connection
try {
  await mongoose.connect(mongoDB);
} catch (err) {
  console.error(`MongoDB connection err: ${err.message}`);
  process.exit(1);
}

// global middlewares
const app = express();
app.use(cors());
app.use(express.json());

// routers
app.use("/users", user);
app.use("/videos", video);

// general error handlement
app.use(errHandler);

app.listen(port, () => console.log(`Server is running on ${port}`));
