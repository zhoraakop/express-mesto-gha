const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/Unauthorized-error');

const auth = (req, res, next) => {
  let payload;
  const token = req.headers.authorization;

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  try {
    payload = jwt.verify(token, 'SECRET_KEY');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
