import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: 'ap-northeast-1_QVySlMzWC',
  tokenUse: "id",
  clientId: '4pt7k3nbsrebnuvsq2fsna9hvh'
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