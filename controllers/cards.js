const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;

const cardModel = require('../models/card');

const getAllCards = (req, res) => {
  cardModel.find({}).then((cards) => {
    res.status(HTTP_STATUS_OK).send(cards);
  }).catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel.create({ name, link, owner })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send(card);
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then(() => {
      res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
    }).catch((err) => {
      if (err.message === 'NotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточки с указанным _id не существует' });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const putLikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((newCard) => {
      res.status(HTTP_STATUS_OK).send(newCard);
    }).catch((err) => {
      if (err.message === 'NotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточки с указанным _id не существует' });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteLikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((newCard) => res.status(HTTP_STATUS_OK).send(newCard))
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточки с указанным _id не существует' });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      console.log(err);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
};
