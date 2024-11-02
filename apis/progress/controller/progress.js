import { cache, Err, msgBuilder } from "../../shared/index.js"

export async function fetchProgress(req, res, next) {
    try {
        const taskId = req.params.taskId
        const data = await cache.get(taskId)
        if (!data) throw new Err(404, "the task does not exist")
        const progress = data.value
        if (progress >= 100)
            await cache.delete(taskId)
        return res.json(msgBuilder(data.value))
    } catch (e) {
        next(e)
    }
}