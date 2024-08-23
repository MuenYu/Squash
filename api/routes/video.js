import express from "express";
import fileUpload from "express-fileupload";
import CheckCredential from "../middleware/auth.js";
import {
  list,
  compress,
  download
} from "../controller/videoController.js";

const router = express.Router();
router.use(CheckCredential);

router.use(
  fileUpload({
    limits: { fileSize: Number(process.env.UPLOAD_MAXSIZE) }, // limit max file size
    abortOnLimit: true,
  })
);

/**
 * List user's video
 */
router.get("/", list);

router.post("/compress", compress);

router.get("/:fileName", download);

export default router;
