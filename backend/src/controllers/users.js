import User from '../models/User.js';
import Order from '../models/Order.js';
import { successResponse, errorResponse, paginatedResponse, createPagination } from '../utils/response.js';
import { deleteCache, deleteCachePattern } from '../config/redis.js';
import logger from '../utils/logger.js';

/**
 * Получение списка всех пользователей (только для администраторов)
 * GET /api/v1/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isActive,
      search,
      sort = '-createdAt',
    } = req.query;

    // Построение фильтра
    const filter = {};

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select('-password -refreshTokens')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const pagination = createPagination(page, limit, total);

    return paginatedResponse(res, users, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение пользователя по ID (только для администраторов)
 * GET /api/v1/users/:id
 */
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password -refreshTokens');

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    // Получение статистики заказов
    const ordersStats = await Order.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$pricing.total' },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
    ]);

    const userWithStats = {
      ...user.toObject(),
      stats: ordersStats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        completedOrders: 0,
      },
    };

    return successResponse(res, userWithStats);
  } catch (error) {
    next(error);
  }
};

/**
 * Создание пользователя (только для администраторов)
 * POST /api/v1/users
 */
export const createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    // Проверка существования email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Пользователь с таким email уже существует', 400);
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role || 'user',
    });

    logger.info(`User created by admin: ${user.email}`);

    return successResponse(
      res,
      user.toPublicJSON(),
      'Пользователь создан',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление пользователя (только для администраторов)
 * PUT /api/v1/users/:id
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, role, isActive } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    // Обновление полей
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    // Очистка кэша
    await deleteCache(`user:${id}`);

    logger.info(`User updated by admin: ${user.email}`);

    return successResponse(res, user.toPublicJSON(), 'Пользователь обновлен');
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление пользователя (мягкое - деактивация) (только для администраторов)
 * DELETE /api/v1/users/:id
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    // Мягкое удаление - деактивация
    user.isActive = false;
    await user.save();

    // Очистка кэша
    await deleteCache(`user:${id}`);

    logger.info(`User deactivated: ${user.email}`);

    return successResponse(res, null, 'Пользователь деактивирован');
  } catch (error) {
    next(error);
  }
};

/**
 * Изменение пароля пользователя (только для администраторов)
 * PATCH /api/v1/users/:id/password
 */
export const changeUserPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const user = await User.findById(id).select('+password');

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    user.password = newPassword;
    user.refreshTokens = []; // Выход со всех устройств
    await user.save();

    // Очистка кэша
    await deleteCache(`user:${id}`);

    logger.info(`User password changed by admin: ${user.email}`);

    return successResponse(res, null, 'Пароль изменен');
  } catch (error) {
    next(error);
  }
};

/**
 * Изменение роли пользователя (только для администраторов)
 * PATCH /api/v1/users/:id/role
 */
export const changeUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    user.role = role;
    await user.save();

    // Очистка кэша
    await deleteCache(`user:${id}`);

    logger.info(`User role changed to ${role}: ${user.email}`);

    return successResponse(res, user.toPublicJSON(), 'Роль изменена');
  } catch (error) {
    next(error);
  }
};

/**
 * Получение заказов пользователя (только для администраторов)
 * GET /api/v1/users/:id/orders
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    const filter = { user: id };
    if (status) filter.status = status;

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate('items.product', 'name slug images')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const pagination = createPagination(page, limit, total);

    return paginatedResponse(res, orders, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Добавление адреса доставки пользователю
 * POST /api/v1/users/:id/addresses
 */
export const addAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const address = req.body;

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    // Если это первый адрес или задан по умолчанию
    if (address.isDefault || user.addresses.length === 0) {
      // Сброс других адресов
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }

    user.addresses.push(address);
    await user.save();

    // Очистка кэша
    await deleteCache(`user:${id}`);

    return successResponse(res, user.toPublicJSON(), 'Адрес добавлен');
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление адреса доставки
 * DELETE /api/v1/users/:id/addresses/:addressId
 */
export const removeAddress = async (req, res, next) => {
  try {
    const { id, addressId } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );

    await user.save();

    // Очистка кэша
    await deleteCache(`user:${id}`);

    return successResponse(res, user.toPublicJSON(), 'Адрес удален');
  } catch (error) {
    next(error);
  }
};

/**
 * Получение статистики пользователей (только для администраторов)
 * GET /api/v1/users/stats/summary
 */
export const getUserStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: ['$isActive', 1, 0] },
          },
          inactiveUsers: {
            $sum: { $cond: ['$isActive', 0, 1] },
          },
          adminUsers: {
            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] },
          },
          managerUsers: {
            $sum: { $cond: [{ $eq: ['$role', 'manager'] }, 1, 0] },
          },
          regularUsers: {
            $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] },
          },
        },
      },
    ]);

    // Новые пользователи за последние 30 дней
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const result = {
      ...(stats[0] || {}),
      newUsersLast30Days: newUsers,
    };

    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  changeUserRole,
  getUserOrders,
  addAddress,
  removeAddress,
  getUserStats,
};
