import Redis from "ioredis";

const redis = new Redis({
  port: Number(process.env.REDIS_PORT) || 6379,
  host: process.env.REDIS_HOST || "localhost",
  password: process.env.REDIS_PASSWORD || "",
});

export async function setProgress(key: string, value: number) {
  await redis.set(key, value);
}

export async function getProgress(key: string): Promise<number> {
  return Number(await redis.get(key));
}
