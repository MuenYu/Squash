import { Queue } from "bullmq";

export interface Task {
    originalName: string;
    fileName: string;
    level: number;
    owner: string;
}

export const queue = new Queue("squash", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || "",
  },
});
