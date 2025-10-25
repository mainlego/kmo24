/**
 * Успешный ответ
 * @param {object} res - Express response object
 * @param {any} data - Данные для отправки
 * @param {string} message - Сообщение
 * @param {number} statusCode - HTTP код ответа
 */
export const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Ответ с ошибкой
 * @param {object} res - Express response object
 * @param {string} message - Сообщение об ошибке
 * @param {number} statusCode - HTTP код ответа
 * @param {array} errors - Массив ошибок
 */
export const errorResponse = (res, message = 'Error', statusCode = 400, errors = null) => {
  const response = {
    success: false,
    error: message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Ответ с пагинацией
 * @param {object} res - Express response object
 * @param {array} data - Данные
 * @param {object} pagination - Информация о пагинации
 */
export const paginatedResponse = (
  res,
  data,
  pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  }
) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      currentPage: pagination.page,
      itemsPerPage: pagination.limit,
      totalItems: pagination.total,
      totalPages: pagination.totalPages,
      hasNextPage: pagination.page < pagination.totalPages,
      hasPrevPage: pagination.page > 1,
    },
  });
};

/**
 * Создание объекта пагинации
 * @param {number} page - Текущая страница
 * @param {number} limit - Лимит элементов
 * @param {number} total - Всего элементов
 */
export const createPagination = (page, limit, total) => {
  return {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export default {
  successResponse,
  errorResponse,
  paginatedResponse,
  createPagination,
};
