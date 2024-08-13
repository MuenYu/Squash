import { DecodeJWT } from "../utils/jwt.js";

export default function CheckCredential(req, res, next) {
  const authHeader = req.headers.authorization;
  // when no jwt token provided
  if (!authHeader)
    return res.status(401).json({ msg: "No authentication token" });
  const token = authHeader.split(" ")[1];
  const data = DecodeJWT(token);
  // when the signature of the token is not correct or expired
  if (data instanceof Error)
    res.status(401).json({ msg: `Invalid token: ${data.message}` });
  req.username = data.username;
  next();
}
