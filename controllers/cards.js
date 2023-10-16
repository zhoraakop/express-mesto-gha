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
  }).catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel.create({ name, link, owner })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send(card);
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then(() => {
      res.status(HTTP_STATUS_OK).send({ message: 'Card Delete' });
    }).catch((err) => {
      if (err.name === 'Error') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: err.message });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
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
      if (err.name === 'Error') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
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
      if (err.name === 'Error') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
};
