const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;

const userModel = require('../models/user');

const createUser = (req, res) => {
  const userData = req.body;
  return userModel
    .create(userData)
    .then((data) => {
      res.status(HTTP_STATUS_CREATED).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорреткные данные' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  const id = req.params.userId;
  userModel.findById(id).then((user) => {
    if (user) {
      return res.status(HTTP_STATUS_OK).send(user);
    }
    return res.status(HTTP_STATUS_OK).send({});
  }).catch((err) => {
    if (err.name === 'CastError') {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Пользователь с таким id не найден' });
    }
    if (err.name === 'ValidationError') {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Переданы некорреткные данные' });
    }
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  });
};

const getUsers = (req, res) => {
  userModel.find().then((users) => {
    res.status(HTTP_STATUS_OK).send(users);
  }).catch(() => {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  });
};

const updateUserById = (req, res) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      console.log(err);
      if (err.message === 'NotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорреткные данные' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорреткные данные' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserById,
};
