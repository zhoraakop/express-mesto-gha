const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/Unauthorized-error');

const auth = (req, res, next) => {
  let payload;
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization;
  try {
    payload = jwt.verify(token, 'SECRET_KEY');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;