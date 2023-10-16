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
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const getUserById = (req, res) => {
  const id = req.params.userId;
  userModel.findById(id).then((user) => {
    if (!user) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'User not Found' });
    }
    return res.status(HTTP_STATUS_OK).send(user);
  }).catch((err) => {
    if (err.name === 'CastError') {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Id' });
    }
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  });
};

const getUsers = (req, res) => {
  userModel.find().then((users) => {
    if (!users) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Users not Found' });
    }
    return res.status(HTTP_STATUS_OK).send(users);
  }).catch(() => {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
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
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Invalid Id' });
      }
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
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
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Id' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserById,
};
