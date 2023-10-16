const router = require('express').Router();
const {
  createUser,
  getUserById,
  getUsers,
  updateUserById,
  updateUserAvatar,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users/:userId', getUserById);
router.get('/users', getUsers);
router.patch('/users/me', updateUserById);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
