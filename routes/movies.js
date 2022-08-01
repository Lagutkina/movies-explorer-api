const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  createMovieValidation,
  deleteMovieValidation,
} = require('../middlewares/validation');

// возвращаем все фильмы
router.get('/', getMovies);

// создаем фильм в коллекцию
router.post('/', createMovieValidation, createMovie);

// удаляем сохраненный фильм по айди
router.delete('/:id', deleteMovieValidation, deleteMovie);

module.exports = router;
