import Ffmpeg from "fluent-ffmpeg";

const input = `${process.env.UPLOAD_PATH}\\sample.mp4`
const output = `${process.env.OUTPUT_PATH}\\output.mp4`
const cmd = Ffmpeg();

const task = cmd
  .input(input)
  .videoCodec("libx265") // Set the video codec
  .audioCodec("libmp3lame") // Set the audio codec
  .outputOptions([
    "-crf 40", // Constant Rate Factor (higher is more compression)
    "-preset veryfast", // Encoding speed vs compression tradeoff
  ])
  .on("start", () => {
    console.log("Compression started.");
  })
  .on("progress", (progress)=>{
    if (isNaN(progress.isNaN))
      console.log(`${Math.floor(progress.percent)}%`)
  })
  .on("end", () => {
    console.log("Compression finished.");
  })
  .on("error", (err) => {
    console.error("Error during compression:", err);
  })
  .save(output);

setTimeout(()=>{
  task.kill()
},2000)
