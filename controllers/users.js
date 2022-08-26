const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// импортируем модуль jsonwebtoken

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const { badRequestErrorMessage, conflictErrorMessage, userNotFoundErrorMessage } = require('../constants/errors-messages');
const { DEV_JWT_SECRET } = require('../constants/dev');

const { NODE_ENV, JWT_SECRET } = process.env; // добавляем среду

// подписываем JWT токен
const signJWT = (userId) => jwt.sign(
  { _id: userId },
  NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET,
  {
    expiresIn: '7d',
  },
);

// возвращаем информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFoundErrorMessage);
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

// обновления профиля - name & email
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFoundErrorMessage);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError(badRequestErrorMessage);
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new ConflictError(conflictErrorMessage);
      } else {
        throw err;
      }
    })
    .catch(next);
};

// создаем юзера с именем и прочими штуками
module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;
  // хешируем пароль
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const token = signJWT(user._id);
      res.send({
        token, name: user.name, email: user.email, _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError(badRequestErrorMessage);
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new ConflictError(conflictErrorMessage);
      } else {
        throw err;
      }
    })
    .catch(next);
};

// Логинимся
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = signJWT(user._id);

      // вернём токен
      res.send({
        token, name: user.name, email: user.email, _id: user._id,
      });
      // аутентификация успешна! вручаем токен пользователю
    })
    .catch(next);
};
