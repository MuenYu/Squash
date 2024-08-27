import fileUpload from "express-fileupload";

export const uploader = fileUpload({
    limits: { fileSize: Number(process.env.UPLOAD_MAXSIZE) }, // limit max file size
    abortOnLimit: true,
    limitHandler: (req, res, next) => {
        return res.status(413).send({
            msg: `File is too large. Maximum file size is ${process.env.UPLOAD_MAXSIZE} bytes.`,
        });
    },
})