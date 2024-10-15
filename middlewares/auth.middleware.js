const { verifyToken } = require("../utils/jwt.util");

const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.sendStatus(403);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.sendStatus(401);
  }

  req.user = decoded;
  next();
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.sendStatus(403);
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRole,
};
