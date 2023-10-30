const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;

const userModel = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const login = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      }).send({ token });
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      userModel.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      }).then((data) => {
        res.status(HTTP_STATUS_CREATED).send({
          email: data.email,
          name: data.name,
          about: data.about,
          avatar: data.avatar,
          _id: data._id,
        });
      }).catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequestError('Передан некорректные данные'));
        }
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
        }
        return next(err);
      });
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  userModel.findById(userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return next(err);
    });
};

const getUserById = (req, res, next) => {
  const id = req.params.userId;
  userModel.findById(id).orFail(() => {
    throw new Error('NotFoundError');
  }).then((user) => {
    res.status(HTTP_STATUS_OK).send(user);
  }).catch((err) => {
    if (err.message === 'NotFoundError') {
      return next(new NotFoundError('Пользователь не найден'));
    }
    if (err.name === 'CastError') {
      return next(new BadRequestError('Передан некорректные данные'));
    }
    return next(err);
  });
};

const getUsers = (req, res, next) => {
  userModel.find({}).then((users) => res.send(users)).catch(next);
};

const updateUserById = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;
  userModel.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Передан некорректные данные'));
      }
      return next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;
  userModel.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Передан некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserById,
  login,
  getCurrentUser,
};
