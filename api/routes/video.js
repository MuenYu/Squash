import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import CheckCredential from "../middleware/auth.js";

const router = express.Router();
router.use(CheckCredential)

router.use(
  fileUpload({
    limits: { fileSize: Number(process.env.UPLOAD_MAXSIZE) }, // limit max file size
    limitHandler: (req, res, next) => {
      return res.status(413).json({msg: "File too large"});
    },
    abortOnLimit: true,
  })
);

/**
 * Video upload
 */
router.put("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json("No files were uploaded.");
  }
  const video = req.files.video;
  const username = req.username;
  if (!video) return res.status(400).json("Wrong upload form name.");
  video.mv(
    path.join(process.env.UPLOAD_PATH, `${username}-${Date.now()}-${video.name}`),
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: "upload success" });
    }
  );
});

/**
 * List user's video
 */
router.get("/list", (req, res) => {});

/**
 * Video delete
 */
router.delete("/:id", (req, res) => {});

export default router;
