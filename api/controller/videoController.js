import asyncHandler from "express-async-handler";
import { errBuilder } from "../middleware/err.js";
import path from "path";
import Video from "../model/video.js";
import Ffmpeg from "fluent-ffmpeg";

const uploadPath = process.env.UPLOAD_PATH;
const outputPath = process.env.OUTPUT_PATH;

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
  const { status } = req.query;
  const filter = {
    owner: username,
  };
  if (status) filter.isCompressed = status === "compressed";
  const data = await Video.find(filter);
  res.json({ data: data });
});

/**
 * remove the specific video record in database
 */
export const remove = asyncHandler(async (req, res) => {
  const username = req.username;
  const fileName = req.params.fileName;
  const result = await Video.deleteOne({
    file_name: fileName,
    owner: username,
  });
  if (result.deletedCount === 0)
    errBuilder(403, "you are not allowed to remove the resource");
  res.json({ msg: "remove success" });
});

export const compress = asyncHandler(async (req, res) => {
  const username = req.username;
  const { fileName, level } = req.body;
  if (!fileName || !level) errBuilder(400, "no video id or compress level");
  const filter = { file_name: fileName, isCompressed: false };
  if (!(await Video.exists(filter)))
    errBuilder(404, "the video to compress does not exist");
  const compressedFileName = `compressed-level${level}-${fileName}`;

  Ffmpeg()
    .input(path.join(uploadPath, fileName))
    .videoCodec("libx265") // Set the video codec
    .audioCodec("libmp3lame") // Set the audio codec
    .outputOptions([
      `-crf ${level}`, // Constant Rate Factor (higher is more compression)
      "-preset veryfast", // Encoding speed vs compression tradeoff
    ])
    .on("progress", (progress) => {
      if (!isNaN(progress.percent))
        console.log(`${Math.floor(progress.percent)}%`);
    })
    .on("end", async () => {
      console.log("Compression finished.");
      const video = new Video({
        file_name: compressedFileName,
        owner: username,
        isCompressed: true,
      });
      await video.save();
      res.json({ msg: `${fileName}` });
    })
    .on("error", (err) => {
      console.error("Error during compression:", err);
      errBuilder(500, err.message);
    })
    .save(path.join(outputPath, compressedFileName));
});

export const download = asyncHandler(async (req, res) => {
  const filter = {
    owner: req.username,
    file_name: req.params.fileName,
  };
  if (!(await Video.exists(filter)))
    errBuilder(404, "the video does not exist");
  res.sendFile(path.join(outputPath, filter.file_name), (err) => {
    if (err) errBuilder(err.status, err.message);
  });
});
