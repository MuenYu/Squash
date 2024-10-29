import { errBuilder } from "./message.js"
import { getParameter } from './parameterstore.js'

const verifier = CognitoJwtVerifier.create({
    userPoolId: await getParameter('userPoolId'),
    tokenUse: "id",
    clientId: await getParameter('clientId')
})

export async function credentialHandler(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        errBuilder(401, "No authentication token")

    const token = authHeader.split(" ")[1];

    try {
        const payload = await verifier.verify(token);
        req.username = payload['cognito:username'];
        next();
    } catch (error) {
        errBuilder(401, `Invalid token: ${error.message}`)
    }
}