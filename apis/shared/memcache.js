import {
    MemcacheClient,
} from "memcache-client";
import { getSecret } from "./secretmanager.js"

export const cache = new MemcacheClient({
    server: await getSecret('memcache')
})

export async function initMemcache() {
    if (!cache) {
        throw new Error("memcache init failed")
    }
    await cache.get('test')
    console.log('memcache init success')
}