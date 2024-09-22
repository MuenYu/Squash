import S3 from "@aws-sdk/client-s3";
import S3Presigner from "@aws-sdk/s3-request-presigner"
import { exist, file2Stream, stream2file } from "./path.js";

const s3client = new S3.S3Client({ region: process.env.AWS_REGION });
const bucketName = "assess2-squash"; // TODO: put it in parameter store

// Create the s3 bucket if not exist
export async function initS3() {
    try {
        // Check if the bucket exists
        const headCommand = new S3.HeadBucketCommand({
            Bucket: bucketName,
        });
        await s3client.send(headCommand);
    } catch (err) {
        if (err.name === "NotFound") { // If the bucket doesn't exist, create it
            const createCommand = new S3.CreateBucketCommand({
                Bucket: bucketName,
            });
            await s3client.send(createCommand);
            console.log(`Bucket "${bucketName}" created.`);
        } else {
            throw err;
        }
    }

    console.log("S3 init success");
}

// Function to delete all objects in the bucket
async function emptyBucket() {
    const listObjectsCommand = new S3.ListObjectsV2Command({
        Bucket: bucketName,
    });
    const listedObjects = await s3client.send(listObjectsCommand);

    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
        const objectsToDelete = listedObjects.Contents.map((item) => ({ Key: item.Key }));

        const deleteObjectsCommand = new S3.DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: {
                Objects: objectsToDelete,
            }
        });
        await s3client.send(deleteObjectsCommand);

        // Recursively call if there are more objects
        if (listedObjects.IsTruncated) {
            await emptyBucket();
        }
    }
}

// Delete all files in S3 and the bucket itself
export async function resetS3() {
    await emptyBucket();

    const deleteBucketCommand = new S3.DeleteBucketCommand({
        Bucket: bucketName,
    });
    await s3client.send(deleteBucketCommand);

    console.log('S3 reset success');
}

// upload a file to S3
export async function put(key, data) {
    const writeCommand = new S3.PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: data
    })
    await s3client.send(writeCommand);
}

// upload a file to s3 by path
export async function putByPath(key, path) {
    const stream = file2Stream(path)
    await put(key, stream)
}

// download a file to specific path
export async function get(key, path) {
    if (!exist(path)) {
        const readCommand = new S3.GetObjectCommand({
            Bucket: bucketName,
            Key: key
        })
        const resp = await s3client.send(readCommand);
        await stream2file(resp.Body, path)
    }
}

export async function getPresignedURL(key) {
    const command = new S3.GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    const presignedURL = await S3Presigner.getSignedUrl(s3client, command, { expiresIn: 3600 });
    return presignedURL;
}