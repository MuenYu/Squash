import express from "express";
import fileUpload from "express-fileupload";
import CheckCredential from "../middleware/auth.js";
import { upload } from "../controller/videoController.js";

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
router.put("/upload", upload);

/**
 * List user's video
 */
router.get("/list", (req, res) => {});

/**
 * Video delete
 */
router.delete("/:id", (req, res) => {});

export default router;
