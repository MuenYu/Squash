import { db, del, put, receive, get, cache } from "../shared/index.js"
import { compressVideo } from "./compress.js"
import { stream2File, file2Stream, delFile } from "./path.js"
import path from "path"

const cwd = process.cwd()
let src, dst

while (true) {
    try {
        // read message
        const msg = await receive()
        // if no message exist
        if (!msg) continue
        // handle the compression task
        const {
            taskId, s3,
            compression_level, owner,
            original_name, ext
        } = JSON.parse(msg.Body)
        // download the file
        const data = await get(s3)
        src = path.join(cwd, `source.${ext}`)
        dst = path.join(cwd, `dest.${ext}`)
        await stream2File(data, src)
        // compress the file, and update the progress
        await compressVideo(src, dst, compression_level, taskId)
        // upload to s3
        const dstS3 = `compressed/${taskId}.${ext}`
        await put(dstS3, file2Stream(dst))
        // write record to db
        await db('history').insert({
            original_name: original_name,
            owner: owner,
            file_name: `${taskId}.${ext}`,
            compression_level: compression_level
        })
        // set the progress to 100
        await cache.set(taskId, 100)
        // destroy msg
        await del(msg.ReceiptHandle)
    } catch (e) {
        console.error(e)
    } finally {
        // delete files
        await delFile(src)
        await delFile(dst)
    }
}