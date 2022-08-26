const router = require('express').Router();
const {
  updateUser,
  getCurrentUser,
} = require('../controllers/users');
const {
  updateUserValidation,
} = require('../middlewares/validation');

// возвращаем текущего юзера
router.get('/me', getCurrentUser);

// обновления профиля - name & about
router.patch('/me', updateUserValidation, updateUser);

module.exports = router;
