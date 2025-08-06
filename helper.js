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

exports.verifyToken = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    return this.sendResponse(res, 401, "Token invalid")
  }
  const bearer = bearerToken.split(" ");
  const token = bearer[1];
  jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
    req.userData = decoded;
  });
};

exports.sendResponse = (res, statusCode, msg, data) => {
  res.status(statusCode).json({
    status: statusCode < 400 ? true : false,
    msg: msg,
    data: data,
  });
};
