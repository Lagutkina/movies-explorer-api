require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // JSON middelware
const { errors } = require('celebrate');

const log = require('./utils/logger');
const cors = require('./middlewares/cors');
const errorsMiddlewares = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const { DEV_DB_URL } = require('./constants/dev');
const { limiter } = require('./middlewares/rateLimit');

const { PORT = 3002, DB_URL, NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === 'production' ? DB_URL : DEV_DB_URL); // подключаемся к  БД

const app = express(); // заводим сервер
app.use(requestLogger); // логер запросов

app.use(limiter); // подключаем лимитер
app.use(helmet()); // подключаем суперзащиту

app.use(bodyParser.urlencoded({ extended: false })); // express понимает JSON запросы
app.use(bodyParser.json()); // express понимает JSON запросы

app.use(cors); // cors миддлвара

app.use(routes); // роуты всех страничек

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorsMiddlewares);

app.listen(PORT, () => {
  log.info('started');
});
