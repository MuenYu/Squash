import fileUpload from "express-fileupload";
import { Err } from "../../shared/index.js";

const maxSize = 52428800;

export const uploadHandler = fileUpload({
    limits: { fileSize: Number(maxSize) }, // limit max file size
    abortOnLimit: true,
    limitHandler: (req, res, next) => {
        next(new Err(413, `File is too large. Maximum file size is ${maxSize} bytes.`))
    },
})