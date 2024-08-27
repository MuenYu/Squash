import express from "express";
import CheckCredential from "../middleware/auth.js";
import {
  list,
  compress,
  download,
  progress,
} from "../controller/videoController.js";
import { uploader } from "../middleware/upload.js";

const router = express.Router();
router.use(CheckCredential);

router.get("/", list);

router.post("/compress", uploader, compress);

router.get("/progress/:taskId", progress);

router.get("/:fileName", download);

export default router;
