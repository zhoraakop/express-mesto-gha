const router = require('express').Router();

const {
  getUserById,
  getUsers,
  updateUserById,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { validationUpdateAvatar, validationUserId, validationUpdateInfo } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validationUserId, getUserById);
router.patch('/me', validationUpdateInfo, updateUserById);
router.patch('/me/avatar', validationUpdateAvatar, updateUserAvatar);

module.exports = router;
