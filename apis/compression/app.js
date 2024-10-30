import { db, del, put, receive } from "../shared/index.js"
import { compressVideo } from "./compress.js"
import { stream2File, file2Stream, delFile } from "./path.js"
import path from "path"

const cwd = process.cwd()
const src = path.join(cwd, `source`)
const dst = path.join(cwd, `dest`)

while (true) {
    try {
        // read message
        const msg = await receive()
        // if no message exist
        if (!msg) continue
        // handle the compression task
        const {
            taskId, s3,
            level, owner,
            original_name, ext
        } = JSON.parse(msg.Body)
        // download the file
        const data = await get(s3)
        stream2File(data, src)
        // compress the file, and update the progress
        await compressVideo(src, dst, level, taskId)
        // upload to s3
        const dstS3 = `compressed/${taskId}.${ext}`
        await put(dstS3, file2Stream(dst))
        // write record to db
        await db('history').insert({
            original_name: original_name,
            owner: owner,
            file_name: `${taskId}.${ext}`,
            compression_level: level
        })
        // destroy msg
        del(msg.ReceiptHandle)
    } catch (e) {
        console.error(e)
    } finally {
        // delete files
        await delFile(src)
        await delFile(dst)
    }
}