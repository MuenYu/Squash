import fileUpload from "express-fileupload";
import { getParameter } from "../utils/parameterstore.js";

const maxSize = await getParameter(process.env.PARAMETER_STORE_MAXSIZE) || 52428800;

export const uploader = fileUpload({
    limits: { fileSize: Number(maxSize) }, // limit max file size
    abortOnLimit: true,
    limitHandler: (req, res, next) => {
        return res.status(413).send({
            msg: `File is too large. Maximum file size is ${maxSize} bytes.`,
        });
    },
})