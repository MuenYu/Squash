import { writeFile } from 'fs/promises'
import fs from 'fs'

export async function stream2File(data, path) {
    const byteData = Buffer.from(data)
    await writeFile(path, byteData)
}

export function file2Stream(path) {
    return fs.createReadStream(path)
}

export async function delFile(path) {
    try {
        if (path) await fs.promises.unlink(path)
    } catch(e) {
        if (e.code!=='ENOENT')
            console.error(e)
    }
}