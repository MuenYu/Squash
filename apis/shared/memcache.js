import {
    MemcacheClient,
} from "memcache-client";
import { getParameter } from "./parameterstore.js";

export const cache = new MemcacheClient({
    server: await getParameter('memcache')
})

export async function initMemcache() {
    if (!cache) {
        throw new Error("memcache init failed")
    }
    await cache.get('test')
    console.log('memcache init success')
}