import ffmpeg from "fluent-ffmpeg";
import { cache } from "./redis";

export async function compress(
  id: string,
  src: string,
  dst: string,
  level: number
) {
  return new Promise((resolve, reject) => {
    const crf = Math.floor(51 - level * 4.6); // Convert level 1-10 to CRF 46-5
    const preset = level <= 5 ? "veryfast" : "medium";

    ffmpeg(src)
      .videoCodec("libx265")
      .outputOption([`-crf ${crf}`, `-preset ${preset}`])
      .format("mp4")
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        reject(err);
      })
      .on("progress", async (progress) => {
        if (progress?.percent) {
          await cache.set(id, progress?.percent);
        }
      })
      .on("end", async () => {
        await cache.set(id, 100);
        resolve(true);
      })
      .save(dst);
  });
}
