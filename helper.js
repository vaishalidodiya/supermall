const jwt = require("jsonwebtoken");

exports.createToken = (data) => {
  const token = jwt.sign(
    {
      id: data.id,
      userType: data.user_type,
      email: data.email.toLowerCase(),
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRATION
        ? `${process.env.JWT_EXPIRATION}ms`
        : "10800000ms",
    }
  );
  return token;
};

exports.sendResponse = (res,statusCode,msg,data) => {
    res.status(statusCode).json({
        status: statusCode < 400 ? true:false,
        msg: msg,
        data: data
    })
}
