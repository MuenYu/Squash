import { Worker } from "bullmq";
import { minioClient } from "./lib/minio";
import { compress } from "./lib/compress";
import fs from "fs/promises";
import { prisma } from "./lib/prisma";
import { cache, connection } from "./lib/redis";

interface Task {
  originalName: string;
  fileName: string;
  level: number;
  owner: string;
}

const worker = new Worker(
  "squash",
  async (job) => {
    const id = job.name as string;
    const task = job.data as Task;
    const src = task.fileName;
    const dst = "output.mp4";

    try {
      // fetch the file
      await minioClient.fGetObject("origin", task.fileName, task.fileName);
      // handle video compression
      await compress(id, src, dst, task.level);
      // write it back to minio
      await minioClient.fPutObject("compressed", src, dst);
      // add record
      await prisma.record.create({
        data: {
          original_name: task.originalName,
          compressed_name: task.fileName,
          level: task.level,
          owner: task.owner,
        },
      });
    } catch (e) {
      console.error("error", e);
    } finally {
      // remove the temporary file from local filesystem
      await fs.unlink(src);
      await fs.unlink(dst);
    }
  },
  { connection }
);

worker.on("completed", async (job, id) => {
  // remove task
  setTimeout(async () => {
    await cache.del(id);
  }, 3000);
});

worker.on("error", (error: Error) => {
  console.error("error", error);
});
