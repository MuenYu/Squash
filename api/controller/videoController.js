import asyncHandler from "express-async-handler";
import { errBuilder } from "../middleware/err.js";
import path from "path";
import Video from "../model/video.js";

export const upload = asyncHandler((req, res) => {
  // check if file is uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    errBuilder(400, "No files were uploaded");
  }

  // check if the form name is correct
  const file = req.files.video;
  const username = req.username;
  if (!file) errBuilder(400, "Wrong form name");

  // save the file and record in db
  const newFileName = `${username}-${Date.now()}-${file.name}`;
  file.mv(path.join(process.env.UPLOAD_PATH, newFileName), async (err) => {
    if (err) throw err;
    const video = new Video({
      file_name: newFileName,
      owner: username,
      isCompressed: false,
    });
    await video.save();
    res.json({ msg: "upload success" });
  });
});

/**
 * List all videos of the user that are uploaded/compressed
 */
export const list = asyncHandler(async (req, res) => {
  const username = req.username;
  const status = req.params.status;
  const data = await Video.find({
    owner: username,
    isCompressed: status === "compressed",
  });
  res.json({ data: data });
});
