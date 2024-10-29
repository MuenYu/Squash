import { db, msgBuilder } from "../../shared/index.js";

export async function fetchHistory(req, res) {
    const username = req.username
    const data = await db('history')
        .where({ owner: username })
        .select('original_name', 'file_name', 'compression_level', 'create_time')
    res.json(msgBuilder(undefined, data))
}