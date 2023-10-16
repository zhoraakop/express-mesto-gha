const router = require('express').Router();

const { notFoundPage } = require('../controllers/notFoundPage');

router.use('/*', notFoundPage);

module.exports = router;
