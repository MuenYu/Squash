/**
 * The general msg builder for all services
 * @param {*} code http code
 * @param {*} msg the message to return
 * @param {*} data the data to return
 * @returns 
 */
export function msgBuilder(msg, data) {
    return {
        msg: msg ?? 'success',
        ...(data && { data: data })
    }
}

export class Err extends Error {
    constructor(code, msg) {
        super(msg)
        this.code = code
    }
}
