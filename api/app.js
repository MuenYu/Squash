import express from "express";
import user from "./routes/user.js";
import video from "./routes/video.js";
import {
  createPathIfNotExist,
  uploadPath,
  outputPath,
  publicPath,
} from "./utils/path.js";
import cors from "cors";
import { errHandler } from "./middleware/err.js";
import mongoose from "mongoose";
import path from "path";

// app conf
const port = process.env.PORT || 3000;
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
app.use(express.static(publicPath));

// routers
app.use("/api/users", user);
app.use("/api/videos", video);
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// general error handlement
app.use(errHandler);

app.listen(port, () => console.log(`Server is running on ${port}`));
