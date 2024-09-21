import express from "express";
import CheckCredential from "../middleware/auth.js";
import {
  list,
  compress,
  download,
  progress,
  history,
  detail,
} from "../controller/videoController.js";
import { uploader } from "../middleware/upload.js";

const router = express.Router();
router.use(CheckCredential);

router.get("/upload", list);

router.get("/detail/:fileName", detail);

router.get("/history", history);

router.post("/compress", uploader, compress);

router.get("/progress/:taskId", progress);

router.get("/:fileName", download);

export default router;
