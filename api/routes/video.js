import express from "express";
import fileUpload from "express-fileupload";
import CheckCredential from "../middleware/auth.js";
import {
  list,
  compress,
  download,
  progress,
} from "../controller/videoController.js";

const router = express.Router();
router.use(CheckCredential);

router.use(
  fileUpload({
    limits: { fileSize: Number(process.env.UPLOAD_MAXSIZE) }, // limit max file size
    abortOnLimit: true,
    limitHandler: (req, res, next) => {
      return res.status(413).send({
        msg: `File is too large. Maximum file size is ${process.env.UPLOAD_MAXSIZE} bytes.`,
      });
    },
  })
);

router.get("/", list);

router.post("/compress", compress);

router.get("/progress/:taskId", progress);

router.get("/:fileName", download);

export default router;
