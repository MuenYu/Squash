import express from "express";
import { GenJWT } from "../utils/jwt.js";

const router = express.Router();

// hardcoded user list
const userList = new Map([
  ["user1", "user1"],
  ["user2", "user2"],
  ["user3", "user3"],
]);

/**
 * Login API
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!userList.has(username)) {
    res.status(401).json({ msg: "invalid username" });
  } else if (userList.get(username) !== password) {
    res.status(401).json({ msg: "wrong password" });
  } else {
    res.json({ token: GenJWT({ username: username }) });
  }
});

export default router;
