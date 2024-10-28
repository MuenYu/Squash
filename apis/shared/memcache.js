import {
    MemcacheClient,
} from "memcache-client";
import { getSecret } from "./secretmanager.js"

export const mClient = new MemcacheClient({
    server: await getSecret('memcache')
})

export async function initMemcache() {
    if (!mClient) {
        throw new Error("memcache init failed")
    }
    console.log('memcache init success')
}