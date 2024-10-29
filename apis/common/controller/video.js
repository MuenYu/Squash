import { db, Err, getPresignedURL, msgBuilder } from "../../shared/index.js";
import { v4 as uuidv4 } from "uuid"

export async function downloadVideo(req, res, next) {
    try {
        const video = await db('history').select('file_name').where({
            owner: req.username,
            file_name: req.params.videoName
        })
        if (!video) throw new Err(404, 'the video does not exist')
        const url = await getPresignedURL(`/compressed/${video.file_name}`)
        res.json(msgBuilder(url))
    } catch (e) {
        next(e)
    }
}

export async function uploadVideo(req, res, next) {
    try {
        const uploadVideo = req?.files?.videoFile
        if (!uploadVideo) throw new Err(400, 'bad request')
        const fileName = uploadVideo.name
        const ext = fileName.split('.').pop()
        const taskId = uuidv4()
        const s3key = `uploaded/${taskId}.${ext}`
        res.json(s3key)
    } catch (e) {
        next(e)
    }
}