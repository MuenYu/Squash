import asyncHandler from "express-async-handler";
import { errBuilder } from "../middleware/err.js";
import path from "path";
import Video from "../model/video.js";
import Ffmpeg from "fluent-ffmpeg";

const uploadPath = process.env.UPLOAD_PATH;
const outputPath = process.env.OUTPUT_PATH;

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

export const compress = asyncHandler(async (req, res) => {
  const username = req.username;
  const level = req.body.level;
  // request check
  if (!req?.files?.videoFile || !level) {
    errBuilder(400, "bad request");
  }
  const file = req.files.videoFile;
  // save the file
  const newFileName = `${username}-${Date.now()}-${file.name}`;
  await file.mv(
    path.join(process.env.UPLOAD_PATH, newFileName),
    async (err) => {
      if (err) throw err;
    }
  );
  // start compression
  
  Ffmpeg()
    .input(path.join(uploadPath, newFileName))
    .videoCodec("libx265") // Set the video codec
    .audioCodec("libmp3lame") // Set the audio codec
    .outputOptions([
      `-crf ${level}`, // Constant Rate Factor (higher is more compression)
      "-preset veryfast", // Encoding speed vs compression tradeoff
    ])
    .on("start", (progress)=> {

    })
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

  return res.json("ok");
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
