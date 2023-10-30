const router = require('express').Router();
const auth = require('../middlewares/auth');
const cookieParser = require('cookie-parser');

const { login, createUser } = require('../controllers/users');
const userRouter = require('../models/user');
const cardRouter = require('../models/card');
const { validationCreateUser, validationLog } = require('../middlewares/validation');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLog, login);
router.use(cookieParser);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

module.exports = router;
