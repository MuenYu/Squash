import { CognitoJwtVerifier } from "aws-jwt-verify";
import { getSecret } from "../utils/secretmanager.js";

const userPoolId = await getSecret('userPoolId')
const clientId = await getSecret('clientId')

const verifier = CognitoJwtVerifier.create({
  userPoolId: userPoolId,
  tokenUse: "id",
  clientId: clientId
});

export default async function CheckCredential(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader)
    return res.status(401).json({ msg: "No authentication token" });
  
  const token = authHeader.split(" ")[1];
  
  try {
    const payload = await verifier.verify(token);
    req.username = payload['cognito:username'];
    next();
  } catch (error) {
    res.status(401).json({ msg: `Invalid token: ${error.message}` });
  }
}