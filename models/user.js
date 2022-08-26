const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const validator = require('validator');
const NotFoundError = require('../errors/not-found-err');
const { wrongDataNotFoundErrorMessage, wrongDataValidationErrorMessage } = require('../constants/errors-messages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: () => wrongDataValidationErrorMessage, // фиг знает работает ли это
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // запрещаем возвращать пароль
  },
});
// метод схемы для проверки логина
userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email })
    .select('+password') // даем взять хэш пароля для проверки логина
    .then((user) => {
      if (!user) {
        // юзер не найден
        return Promise.reject(
          new NotFoundError(wrongDataNotFoundErrorMessage),
        );
      }
      // юзер найден, сравниваем пароли
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new NotFoundError(wrongDataNotFoundErrorMessage),
          );
        }

        return user; // возвращаем юзера, так как все совпало
      });
    });
};
module.exports = mongoose.model('user', userSchema);
