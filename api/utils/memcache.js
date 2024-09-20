import {
    MemcacheClient,
} from "memcache-client";
import { getSecret } from "./secretmanager.js"

const key = "memcache"
export let mClient = false

export async function connectMemcache() {
    if (!mClient) {
        const server = await getSecret(key);
        mClient = new MemcacheClient({ server })
        console.log('memcache init success')
    }
}