import * as minio from "minio";

const minioClient = new minio.Client({
  endPoint: process.env.MINIO_HOST || "localhost",
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_KEY || "",
  secretKey: process.env.MINIO_SECRET || "",
});

export async function upload2Origin(objectName: string, binary: Buffer) {
  await minioClient.putObject("origin", objectName, binary);
}

export async function fetchFromTarget() {

}
