import express from "express";
import user from "./routes/user.js";
import video from "./routes/video.js";
import { createPathIfNotExist } from "./utils/path.js";
import cors from "cors";
import { errHandler } from "./middleware/err.js";

// app conf
const port = process.env.Port || 3000;
const uploadPath = process.env.UPLOAD_PATH;
const outputPath = process.env.OUTPUT_PATH;

// create folders for upload and output if not exist
createPathIfNotExist(uploadPath);
createPathIfNotExist(outputPath);

// global middlewares
const app = express();
app.use(cors());
app.use(express.json());

// routers
app.use("/user", user);
app.use("/video", video);

// general error handlement
app.use(errHandler);

app.listen(port, () => console.log(`Server is running on ${port}`));
