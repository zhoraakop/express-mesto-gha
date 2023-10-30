const router = require('express').Router();
const cookieParser = require('cookie-parser');
const auth = require('../middlewares/auth');

const { login, createUser } = require('../controllers/users');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { validationCreateUser, validationLog } = require('../middlewares/validation');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLog, login);
router.use(cookieParser);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
