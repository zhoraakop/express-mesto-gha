const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const notFoundPage = require('./routes/notFoundPage');
const errorHandler = require('./middlewares/error-handler');

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  });

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(notFoundPage);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
