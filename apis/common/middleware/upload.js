import fileUpload from "express-fileupload";

const maxSize = 52428800;

export const uploadHandler = fileUpload({
    limits: { fileSize: Number(maxSize) }, // limit max file size
    abortOnLimit: true,
    limitHandler: (req, res, next) => {
        return res.status(413).send({
            msg: `File is too large. Maximum file size is ${maxSize} bytes.`,
        });
    },
})