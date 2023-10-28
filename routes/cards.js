const router = require('express').Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');
const { validationCardId, validationCreateCard } = require('../middlewares/validation');

router.get('/', getAllCards);
router.post('/', validationCreateCard, createCard);
router.delete('/:cardId', validationCardId, deleteCard);
router.put('/:cardId/likes', validationCardId, putLikeCard);
router.delete('/:cardId/likes', validationCardId, deleteLikeCard);

module.exports = router;
