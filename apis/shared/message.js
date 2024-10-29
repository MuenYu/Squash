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

class CustomErr extends Error {
    constructor(code, msg) {
        super(msg)
        this.code = code
    }
}

export function errBuilder(code, msg) {
    throw new CustomErr(code, msg)
}

