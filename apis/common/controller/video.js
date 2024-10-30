import { cache, db, Err, getPresignedURL, msgBuilder, put, send } from "../../shared/index.js";
import { v4 as uuidv4 } from "uuid"

export async function downloadVideo(req, res, next) {
    try {
        const video = await db('history').select('file_name').where({
            owner: req.username,
            file_name: req.params.videoName
        }).first()
        if (!video) throw new Err(404, 'the video does not exist')
        const url = await getPresignedURL(`/compressed/${video.file_name}`)
        res.json(msgBuilder(url))
    } catch (e) {
        next(e)
    }
}

export async function uploadAndCompress(req, res, next) {
    try {
        // TODO: remove the default username
        const owner = req.username ?? 'unknown'
        const file = req?.files?.videoFile
        const level = req.body.level ?? 38
        if (!file) throw new Err(400, 'bad request')
        const original_name = file.name
        const ext = original_name.split('.').pop()
        const taskId = uuidv4()
        const file_name = `${taskId}.${ext}`
        const s3key = `uploaded/${file_name}`
        // upload video to s3
        await put(s3key, file.data)
        // write record to db
        await db('videos').insert({
            file_name: file_name,
            original_name: original_name,
            owner: owner,
        })
        // add task to sqs
        await send({
            file_name: s3key,
            original_name: original_name,
            compression_level: level,
            owner: owner
        })
        // set the progress to 0
        await cache.set(taskId, 0)
        res.json(msgBuilder(taskId))
    } catch (e) {
        next(e)
    }
}

export async function compress(req, res, next) {
    try {
        const owner = req.username ?? 'unknown'
        const file_name = req.params.videoName
        const level = req.body.level ?? 38
        // find the video user uploaded
        const video = await db('videos')
            .select('*')
            .where({
                owner: owner,
                file_name: file_name
            }).first()
        // if not exist, return 404
        if (!video) throw new Err(404, 'the video to compress does not exist')
        const original_name = video.original_name
        const ext = original_name.split('.').pop()
        const taskId = uuidv4()
        const s3key = `uploaded/${taskId}.${ext}`
        // define the new task
        const task = {
            original_name: original_name,
            file_name: s3key,
            compression_level: level,
            owner: owner
        }
        // send task to sqs
        await send(task)
        // set the progress to 0
        await cache.set(taskId, 0)
        res.json(msgBuilder(taskId))
    } catch (e) {
        next(e)
    }
}