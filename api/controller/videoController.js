import asyncHandler from "express-async-handler";
import { errBuilder } from "../middleware/err.js";
import path from "path";

export const upload = asyncHandler((req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    errBuilder(400, "No files were uploaded");
  }
  const video = req.files.video;
  const username = req.username;
  if (!video) errBuilder(400, "Wrong form name");
  video.mv(
    path.join(
      process.env.UPLOAD_PATH,
      `${username}-${Date.now()}-${video.name}`
    ),
    (err) => {
      if (err) errBuilder(500, "No files were uploaded");
      res.json({ msg: "upload success" });
    }
  );
});
