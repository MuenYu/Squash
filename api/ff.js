import Ffmpeg from "fluent-ffmpeg";

const input = "D:\\projects\\CAB432\\api\\sample.mp4";
const output = "D:\\projects\\CAB432\\api\\output.mp4";
const cmd = Ffmpeg();

cmd
  .input(input)
  .videoCodec("libx265") // Set the video codec
  .audioCodec("libmp3lame") // Set the audio codec
  .outputOptions([
    "-crf 40", // Constant Rate Factor (higher is more compression)
    "-preset fast", // Encoding speed vs compression tradeoff
  ])
  .on("start", () => {
    console.log("Compression started.");
  })
  .on("progress", (progress)=>{
    console.log(`progress: ${progress.percent}`)
  })
  .on("end", () => {
    console.log("Compression finished.");
  })
  .on("error", (err) => {
    console.error("Error during compression:", err);
  })
  .save(output);
