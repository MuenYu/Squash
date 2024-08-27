import asyncHandler from "express-async-handler";
import { errBuilder } from "../middleware/err.js";
import path from "path";
import Video from "../model/video.js";
import Ffmpeg from "fluent-ffmpeg";
import { v4 as uuidv4 } from "uuid";
import { uploadPath, outputPath } from "../utils/path.js";

const taskMap = new Map();

/**
 * List all videos of the user that are uploaded/compressed
 */
export const list = asyncHandler(async (req, res) => {
  const username = req.username;
  const filter = {
    owner: username,
  };
  const data = await Video.find(filter).sort({ create_time: -1 });
  res.json({ data: data });
});

export const progress = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  if (!taskMap.has(taskId))
    errBuilder(404, "The compression task does not exist");
  const progress = taskMap.get(taskId);
  if (progress >= 100) taskMap.delete(taskId);
  return res.json({ progress: progress });
});

export const compress = asyncHandler(async (req, res) => {
  const username = req.username;
  const level = req.body.level;
  let videoName = req.body.videoName;
  let originalName = ''

  if (!level) errBuilder(400, "bad request");

  if (videoName?.length > 0) { // use existing video
    const video = await Video.findOne({ file_name: videoName, compression_level: undefined })
    originalName = video.original_name
  } else if (req?.files?.videoFile) { // upload new video
    if (!req?.files?.videoFile) errBuilder(400, "bad request")
    const file = req.files.videoFile;
    originalName = file.name;
    videoName = `${username}-${Date.now()}-${originalName}`;
    // save the file to disk
    await file.mv(
      path.join(uploadPath, videoName),
      async (err) => {
        if (err) throw err;
      }
    );
    const video = new Video({
      original_name: originalName,
      owner: username,
      file_name: videoName
    })
    await video.save();
  } else {
    errBuilder(400, "bad request");
  }

  // start compression
  const compressedFileName = `${Date.now()}-${level}-${videoName}`;
  const taskId = uuidv4();
  Ffmpeg()
    .input(path.join(uploadPath, videoName))
    .videoCodec("libx265") // Set the video codec
    .audioCodec("libmp3lame") // Set the audio codec
    .outputOptions([
      `-crf ${level}`, // Constant Rate Factor (higher is more compression)
      "-preset veryfast", // Encoding speed vs compression tradeoff
    ])
    .on("start", async () => {
      taskMap.set(taskId, 0)
      res.json({ taskId: taskId, fileName: videoName });
    })
    .on("progress", (progress) => {
      if (!isNaN(progress.percent))
        taskMap.set(taskId, Math.floor(progress.percent));
    })
    .on("end", async () => {
      const video = new Video({
        original_name: originalName,
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
