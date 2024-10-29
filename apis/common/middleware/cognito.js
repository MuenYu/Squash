import { errBuilder,getParameter } from "../../shared/index.js"
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
    userPoolId: await getParameter('userPoolId'),
    tokenUse: "id",
    clientId: await getParameter('clientId')
})

export async function credentialHandler(req, res, next) {
    const authHeader = req.headers.authorization;

    try {
        if (!authHeader)
            errBuilder(401, "No authentication token")

        const token = authHeader.split(" ")[1];

        const payload = await verifier.verify(token);
        req.username = payload['cognito:username'];
        next();
    } catch (error) {
        next(error)
    }
}