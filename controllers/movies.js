const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const { badRequestErrorMessage, forbiddenErrorMessage, movieNotFoundErrorMessage } = require('../constants/errors-messages');
// возвращаем все фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send(movie))
    .catch(next);
};

// создаем фильм в коллекцию
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    trailerLink,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    trailerLink,
    owner: req.user._id,
  }) // добавляем айди оунера
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError(badRequestErrorMessage);
      } else {
        throw err;
      }
    })
    .catch(next);
};

// удаляем сохраненный фильм по айди
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(movieNotFoundErrorMessage);
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenErrorMessage);
      } else {
        return Movie.findByIdAndRemove(req.params.id).then((m) => res.send(m));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new NotFoundError(movieNotFoundErrorMessage);
      } else {
        throw err;
      }
    })
    .catch(next);
};
