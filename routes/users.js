const router = require('express').Router();

const {
  getUserById,
  getUsers,
  updateUserById,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get(':userId', getUserById);
router.get('/', getUsers);
router.patch('/me', updateUserById);
router.patch('/me/avatar', updateUserAvatar);
router.get('/me', getCurrentUser);

module.exports = router;
