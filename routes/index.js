const router = require('express').Router();
const { errors } = require('celebrate');
const auth = require('../middlewares/auth');

const { login, createUser } = require('../controllers/users');
const userRouter = require('../models/user');
const cardRouter = require('../models/card');
const errorHandler = require('../middlewares/error-handler');

router.post('/signup', createUser);
router.post('/signin', login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use(errors());
router.use(errorHandler);

module.exports = router;
