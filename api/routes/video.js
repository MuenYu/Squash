import express from "express";
import fileUpload from "express-fileupload";
import CheckCredential from "../middleware/auth.js";
import { upload, list, remove, compress } from "../controller/videoController.js";

const router = express.Router();
router.use(CheckCredential);

router.use(
  fileUpload({
    limits: { fileSize: Number(process.env.UPLOAD_MAXSIZE) }, // limit max file size
    abortOnLimit: true,
  })
);

/**
 * Video upload
 */
router.post("/upload", upload);

/**
 * List user's video
 */
router.get("/", list);

/**
 * Video delete
 */
router.delete("/:fileName", remove);

router.post("/compressions", compress);

export default router;
