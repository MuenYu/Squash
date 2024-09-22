import { getSecret } from "./secretmanager.js"
import knex from "knex";

const host = await getSecret("rdsHost")
const user = await getSecret("rdsUser")
const password = await getSecret("rdsPass")
const database = await getSecret("rdsDB")

export const rds = knex({
    client: 'mysql2', // Use 'mysql2' as the client for MySQL connections
    connection: {
        host: host,        // Replace with your DB host
        user: user,             // Replace with your DB username
        password: password,     // Replace with your DB password
        database: database,  // Replace with your DB name
        multipleStatements: true
    },
    pool: { min: 0, max: 10 }, // Optional: Pooling options for managing connections
});

export async function initRDS() {
    if (rds) {
        await rds.raw(initSQL);
        console.log('rds init success');
    } else {
        throw new Error("mysql init failed: no connection established")
    }
}

export async function resetRDS() {
    if (rds){
        await rds.raw("drop table history;");
        await rds.destroy();
        console.log('rds reset success')
    }else {
        throw new Error("mysql reset failed: no connection established")
    }
}

const initSQL = `
USE ${database};

CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL, 
    compression_level VARCHAR(255), 
    file_name VARCHAR(255) NOT NULL,
    s3 VARCHAR(255) NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`