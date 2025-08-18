const jwt = require('jsonwebtoken');
const { sendResponse } = require('../helper');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401,"No token provided",{})
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('verifyToken:::::::::>>>error: ', err)
    return sendResponse(res, 403,'Invalid or expired token',{})
  }
};

module.exports = {verifyToken};
