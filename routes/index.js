const router = require('express').Router();
const users = require('./users');
const movies = require('./movies');
const auth = require('../middlewares/auth');
const {
  createUserValidation,
  loginValidation,
} = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const { pageNotFoundErrorMessage } = require('../constants/errors-messages');

router.post('/signin', loginValidation, login); // роут логина

router.post('/signup', createUserValidation, createUser); // роут регистрации

router.use(auth);// авторизация

router.use('/users', users); // подключение роута для users

router.use('/movies', movies); // подключение роута для cards

router.use('/', (req, res, next) => {
  next(new NotFoundError(pageNotFoundErrorMessage));
});

module.exports = router;
