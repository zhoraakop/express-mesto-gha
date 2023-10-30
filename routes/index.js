const router = require('express').Router();

const auth = require('../middlewares/auth');

const { login, createUser } = require('../controllers/users');
const users = require('./users');
const cards = require('./cards');
const { validationCreateUser, validationLog } = require('../middlewares/validation');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLog, login);

router.use(auth);
router.use('/users', users);
router.use('/cards', cards);

module.exports = router;
