const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/Unauthorized-error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token);
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;
  try {
    payload = jwt.verify(token, 'SECRET_KEY');
  } catch (err) {
    console.log(token);
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  console.log(token);
  req.user = payload;
  return next();
};

module.exports = auth;
