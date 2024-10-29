import { cache, errBuilder, msgBuilder } from "../../shared/index.js"

export async function fetchProgress(req, res, next) {
    try {
        const taskId = req.params.taskId
        const data = await cache.get(taskId)
        if (!data)
            errBuilder(404, 'the compression task does not exist')
        const progress = data.value
        res.json(msgBuilder(progress))
    } catch(e) {
        next(e)
    }
}