import asyncHandler from "express-async-handler";
import { errBuilder } from "../middleware/err.js";
import { GenJWT } from "../utils/jwt.js";

// hardcoded user list
const userList = new Map([
  ["user1", "user1"],
  ["user2", "user2"],
  ["user3", "user3"],
]);

export const login = asyncHandler((req, res) => {
  const { username, password } = req.body;
  if (!userList.has(username) || userList.get(username) !== password) {
    errBuilder(401, "Invalid username or password");
  }
  res.json({ token: GenJWT({ username: username }) });
});
