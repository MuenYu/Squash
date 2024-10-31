import Ffmpeg from "fluent-ffmpeg"
import { cache } from "../shared/index.js";

export async function compressVideo(src, dst, level, taskId) {
    return new Promise((resolve, reject) => {
        Ffmpeg()
            .input(src)
            .videoCodec('libx265') // Set the video codec
            .audioCodec('libmp3lame') // Set the audio codec
            .outputOptions([
                `-crf ${level}`, // Constant Rate Factor (higher is more compression)
                '-preset veryfast', // Encoding speed vs compression tradeoff
            ])
            .on('progress', async (progress) => {
                const percent = progress.percent
                if (!isNaN(percent)) {
                    await cache.set(taskId, Math.floor(percent));
                }
            })
            .on('end', resolve)
            .on('error', reject)
            .save(dst)
    })
}