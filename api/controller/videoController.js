import asyncHandler from "express-async-handler";
import { errBuilder } from "../middleware/err.js";
import path from "path";
import Video from "../model/video.js";
import Ffmpeg from "fluent-ffmpeg";
import { v4 as uuidv4 } from "uuid";

const uploadPath = process.env.UPLOAD_PATH;
const outputPath = process.env.OUTPUT_PATH;
const taskMap = new Map();

/**
 * List all videos of the user that are uploaded/compressed
 */
export const list = asyncHandler(async (req, res) => {
  const username = req.username;
  const filter = {
    owner: username,
  };
  const data = await Video.find(filter);
  res.json({ data: data });
});

export const progress = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  if (!taskMap.has(taskId))
    errBuilder(404, "The compression task does not exist");
  const progress = taskMap.get(taskId);
  if (progress >= 100) taskMap.delete(taskId);
  return res.json({ msg: progress });
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
  const compressedFileName = `compressed-${level}-${newFileName}`;
  const taskId = uuidv4();
  Ffmpeg()
    .input(path.join(uploadPath, newFileName))
    .videoCodec("libx265") // Set the video codec
    .audioCodec("libmp3lame") // Set the audio codec
    .outputOptions([
      `-crf ${level}`, // Constant Rate Factor (higher is more compression)
      "-preset veryfast", // Encoding speed vs compression tradeoff
    ])
    .on("start", () => {
      res.json({ msg: taskId });
    })
    .on("progress", (progress) => {
      if (!isNaN(progress.percent))
        taskMap.set(taskId, Math.floor(progress.percent));
    })
    .on("end", async () => {
      const video = new Video({
        original_name: file.name,
        owner: username,
        compression_level:
          level <= 28 ? "Low" : level <= 38 ? "Medium" : "High",
        file_name: compressedFileName,
      });
      await video.save();
      taskMap.set(taskId, 100);
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
