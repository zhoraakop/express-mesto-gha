const router = require('express').Router();
const auth = require('../middlewares/auth');

const { login, createUser } = require('../controllers/users');
const userRouter = require('../models/user');
const cardRouter = require('../models/card');
const { validationCreateUser, validationLog } = require('../middlewares/validation');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLog, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
