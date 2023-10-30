const router = require('express').Router();

const {
  getUserById,
  getUsers,
  updateUserById,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { validationUpdateAvatar, validationUserId, validationUpdateInfo } = require('../middlewares/validation');

router.get('/:userId', validationUserId, getUserById);
router.get('/', getUsers);
router.patch('/me', validationUpdateInfo, updateUserById);
router.patch('/me/avatar', validationUpdateAvatar, updateUserAvatar);
router.get('/me', getCurrentUser);

module.exports = router;
