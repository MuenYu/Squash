import { Queue } from "bullmq";

export interface Task {
    originalName: string;
    compressedName: string;
    level: number;
    owner: string;
}

const queue = new Queue("squash", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || "",
  },
});
const queueName = "compressionTasks";

export async function addTask(task: Task) {
  await queue.add(queueName, task);
}

