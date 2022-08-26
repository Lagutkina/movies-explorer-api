const { serverErrorMessage } = require('../constants/errors-messages');

module.exports = (err, req, res, next) => {
  // обработчик ошибок
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? serverErrorMessage : message,
  });
  next();
};
