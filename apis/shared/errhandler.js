import { msgBuilder } from "./message.js"

export function errHandler(err, req, res, next) {
    const statusCode = Number.isInteger(err.code) ? err.code : 500; // Use custom status code or default to 500
    console.error(err.message);
    res.status(statusCode).json(msgBuilder(err.message));
}
