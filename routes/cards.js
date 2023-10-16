const router = require('express').Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', putLikeCard);
router.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = router;
