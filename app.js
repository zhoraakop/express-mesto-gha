const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const notFoundPage = require('./routes/notFoundPage');

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  });

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(router);
app.use(notFoundPage);

app.listen(PORT);
