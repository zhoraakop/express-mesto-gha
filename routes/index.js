const router = require('express').Router();
const auth = require('../middlewares/auth');

const { login, createUser } = require('../controllers/users');
const userRouter = require('../models/user');
const cardRouter = require('../models/card');

router.post('/signup', createUser);
router.post('/signin', login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
