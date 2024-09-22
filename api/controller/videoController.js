import asyncHandler from "express-async-handler";
import { errBuilder } from "../middleware/err.js";
import path from "path";
import Video from "../model/video.js";
import Ffmpeg from "fluent-ffmpeg";
import { v4 as uuidv4 } from "uuid";
import { uploadPath, outputPath } from "../utils/path.js";
import { mClient } from "../utils/memcache.js";
import { rds } from "../utils/rds.js";
import fs from "fs"
import { get, put, putByPath } from "../utils/s3.js";

export const detail = asyncHandler(async (req, res) => {
  const filter = {
    owner: req.username,
    file_name: req.params.fileName,
    compression: { $exists: true, $ne: null }
  }
  const video = await Video.findOne(filter, { _id: 0 });
  const info = video.compression;
  if (!video) errBuilder(404, "the video does not exist")
  const data = {
    "Compression level": info.compression_level,
    "Original file size": `${(info.original_size / 1024 / 1024).toFixed(2)} MB`,
    "Compressed file size": `${(info.compressed_size / 1024 / 1024).toFixed(2)} MB`,
    "Compression ratio": info.compression_ratio
  }
  res.json({ data: data })
})

/**
 * show user compression history
 */
export const history = asyncHandler(async (req, res) => {
  const username = req.username;
  const data = await rds('history').where({ owner: username }).select('*')
  res.json({ data: data });
});

/**
 * List all videos of the user that are uploaded
 */
export const list = asyncHandler(async (req, res) => {
  const username = req.username;
  const filter = {
    owner: username,
    compression: undefined
  };
  const data = await Video.find(filter).sort({ create_time: -1 });
  res.json({ data: data });
});

export const progress = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const data = await mClient.get(taskId)
  if (!data)
    errBuilder(404, "The compression task does not exist");
  const progress = data.value
  if (progress >= 100) await mClient.delete(taskId);
  return res.json({ progress: progress });
});

export const compress = asyncHandler(async (req, res) => {
  const username = req.username;
  const level = req.body.level;
  let videoName = req.body.videoName;
  let originalName = ''
  let inputS3Key = ''

  if (!level) errBuilder(400, "bad request");

  if (videoName?.length > 0) { // use existing video
    const video = await Video.findOne({ file_name: videoName, compression: undefined })
    if (!video) errBuilder(404, "the video does not exist")
    originalName = video.original_name
    inputS3Key = video.s3_key
    await get(inputS3Key, path.join(uploadPath, videoName))
  } else if (req?.files?.videoFile) { // upload new video
    if (!req?.files?.videoFile) errBuilder(400, "bad request")
    const file = req.files.videoFile;
    originalName = file.name;
    videoName = `${username}-${Date.now()}-${originalName}`;
    inputS3Key = `upload/${videoName}`

    // Save the file to disk
    await file.mv(path.join(uploadPath, videoName));
    await put(inputS3Key, file.data);

    const video = new Video({
      original_name: originalName,
      file_name: videoName,
      owner: username,
      s3_key: inputS3Key
    })
    await video.save();
  } else {
    errBuilder(400, "bad request");
  }

  // Start compression
  const taskId = uuidv4();
  const compressedFileName = `${taskId}-${videoName}`;
  const originalFilePath = path.join(uploadPath, videoName);
  const compressedFilePath = path.join(outputPath, compressedFileName);

  Ffmpeg()
    .input(originalFilePath)
    .videoCodec('libx265') // Set the video codec
    .audioCodec('libmp3lame') // Set the audio codec
    .outputOptions([
      `-crf ${level}`, // Constant Rate Factor (higher is more compression)
      '-preset veryfast', // Encoding speed vs compression tradeoff
    ])
    .on('start', async () => {
      await mClient.set(taskId, 0);
      res.json({ taskId: taskId, fileName: videoName });
    })
    .on('progress', async (progress) => {
      if (!isNaN(progress.percent)) {
        await mClient.set(taskId, Math.floor(progress.percent));
      }
    })
    .on('end', async () => {
      // Get the sizes of the original and compressed files
      const originalStats = await fs.promises.stat(originalFilePath);
      const compressedStats = await fs.promises.stat(compressedFilePath);
      const compressionLevel = level <= 28 ? 'Low' : level <= 38 ? 'Medium' : 'High';
      const originalSize = originalStats.size; // in bytes
      const compressedSize = compressedStats.size; // in bytes
      const compressionRatio = (originalSize / compressedSize).toFixed(2); // compression ratio
      const outputS3Key = `output/${compressedFileName}`

      // save the file to s3
      await putByPath(outputS3Key, compressedFilePath)

      // Save compressed video details to the database
      await new Video({
        original_name: originalName,
        file_name: compressedFileName,
        s3_key: outputS3Key,
        owner: username,
        compression: {
          compression_level: compressionLevel,
          original_size: originalSize, // in bytes
          compressed_size: compressedSize, // in bytes
          compression_ratio: compressionRatio,
        },
      }).save();
      // Save the history to RDS
      await rds('history').insert({
        original_name: originalName,
        owner: username,
        compression_level: compressionLevel,
        file_name: compressedFileName,
        s3: outputS3Key
      })
      // Mark compression as complete
      await mClient.set(taskId, 100);
    })
    .on('error', async (err) => {
      console.error('Error during compression:', err);
      await mClient.del(taskId); // Clean up the task if it fails
      return errBuilder(500, err.message);
    })
    .save(compressedFilePath);
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
