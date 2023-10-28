const router = require('express').Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putLikeCard);
router.delete('/:cardId/likes', deleteLikeCard);

module.exports = router;
