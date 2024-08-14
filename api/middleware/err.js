class CustomErr extends Error {
    constructor(code, msg) {
        super(msg)
        this.code = code
    }
}

export const errHandler = (err, req, res, next) => {
  const statusCode = err.status || 500; // Use custom status code or default to 500
  console.error(err.message);
  res.status(statusCode).json({ msg: err.message });
};

export const errBuilder = (code, msg) => {
    throw new CustomErr(code, msg)
}