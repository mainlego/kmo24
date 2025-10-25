/**
 * Middleware для обработки несуществующих роутов
 */
const notFound = (req, res, next) => {
  const error = new Error(`Роут не найден - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export default notFound;
