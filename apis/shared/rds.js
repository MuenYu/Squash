import { getSecret } from "./secretmanager.js"
import knex from "knex";

export const db = knex({
    client: 'mysql2', // Use 'mysql2' as the client for MySQL connections
    connection: await getSecret('rds'),
    pool: { min: 0, max: 10 }, // Optional: Pooling options for managing connections
});

export async function initRDS() {
    if (!db) {
        throw new Error("RDS init failed: no connection established")
    }
    await db.raw('SELECT 1+1 AS result');
    console.log('RDS init successfully')
}