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
import path from "path";
import morgan from "morgan";

import { connectMongo } from "./utils/mongo.js";
import { getParameter } from "./utils/parameterstore.js";
import { getSecret } from "./utils/secretmanager.js";
import { connectMemcache } from "./utils/memcache.js";

await getSecret("mongodb");

// app conf
const port = await getParameter(process.env.PARAMETER_STORE_PORT) || 3000;

// create folders for upload and output if not exist
createPathIfNotExist(uploadPath);
createPathIfNotExist(outputPath);

// db connection
try {
  await connectMongo();
  await connectMemcache();
} catch (err) {
  console.error(`Initial connection err: ${err.message}`);
  process.exit(1);
}

// global middlewares
const app = express();
app.use(morgan('tiny'))
app.use(cors());
app.use(express.json());
// app.use(express.static(publicPath));

// routers
app.use("/api/users", user);
app.use("/api/videos", video);
// app.get("*", (req, res) => {
//   res.sendFile(path.join(publicPath, "index.html"));
// });

// general error handlement
app.use(errHandler);

app.listen(port, () => console.log(`Server is running on ${port}`));
