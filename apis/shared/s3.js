import S3 from "@aws-sdk/client-s3"
import S3Presigner from "@aws-sdk/s3-request-presigner"
import { region } from "./const.js";
import { getParameter } from "./parameterstore.js";

const s3client = new S3.S3Client({ region: region });
const bucketName = await getParameter('s3')

export async function getPresignedURL(key) {
    const command = new S3.GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    const presignedURL = await S3Presigner.getSignedUrl(s3client, command, { expiresIn: 3600 });
    return presignedURL;
}

export async function put(key, data) {
    const writeCommand = new S3.PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: data
    })
    await s3client.send(writeCommand);
}

export async function get(key) {
    const readCommand = new S3.GetObjectCommand({
        Bucket: bucketName,
        Key: key
    })
    const resp = await s3client.send(readCommand);
    const chunks = []
    for await (const chunk of resp.Body) {
        chunks.push(chunk)
    }
    return new Uint8Array(Buffer.concat(chunks))
}