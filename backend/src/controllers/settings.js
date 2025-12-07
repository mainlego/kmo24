import Settings from '../models/Settings.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { deleteCache, deleteCachePattern } from '../config/redis-mock.js';
import logger from '../utils/logger.js';

/**
 * Получение всех настроек
 * GET /api/v1/settings
 */
export const getAllSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getAll();
    return successResponse(res, settings);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение настроек по группе
 * GET /api/v1/settings/:group
 */
export const getSettingsByGroup = async (req, res, next) => {
  try {
    const { group } = req.params;
    const settings = await Settings.getByGroup(group);
    return successResponse(res, settings);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение публичных настроек (контакты, общие)
 * GET /api/v1/settings/public
 */
export const getPublicSettings = async (req, res, next) => {
  try {
    const contacts = await Settings.getByGroup('contacts');
    const general = await Settings.getByGroup('general');

    return successResponse(res, {
      contacts,
      general,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление настроек группы
 * PUT /api/v1/settings/:group
 */
export const updateSettings = async (req, res, next) => {
  try {
    const { group } = req.params;
    const settings = req.body;

    const validGroups = ['general', 'contacts', 'pages', 'seo', 'integrations'];
    if (!validGroups.includes(group)) {
      return errorResponse(res, 'Некорректная группа настроек', 400);
    }

    // Обновляем каждую настройку
    const updates = [];
    for (const [key, value] of Object.entries(settings)) {
      const type = typeof value === 'object' ? 'json' : typeof value;
      updates.push(
        Settings.setValue(key, value, { type, group })
      );
    }

    await Promise.all(updates);

    // Очистка кэша
    await deleteCachePattern('settings:*');

    logger.info(`Settings updated for group: ${group}`);

    const updatedSettings = await Settings.getByGroup(group);
    return successResponse(res, updatedSettings, 'Настройки сохранены');
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление одной настройки
 * PUT /api/v1/settings/single/:key
 */
export const updateSingleSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value, type, group, description } = req.body;

    const setting = await Settings.setValue(key, value, { type, group, description });

    // Очистка кэша
    await deleteCache(`settings:${key}`);
    await deleteCachePattern('settings:*');

    logger.info(`Setting updated: ${key}`);

    return successResponse(res, setting, 'Настройка сохранена');
  } catch (error) {
    next(error);
  }
};

/**
 * Изменение пароля текущего админа
 * POST /api/v1/settings/change-password
 */
export const changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Требуется текущий и новый пароль', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'Новый пароль должен содержать минимум 6 символов', 400);
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    // Проверка текущего пароля
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Неверный текущий пароль', 400);
    }

    // Обновление пароля
    user.password = newPassword;
    user.refreshTokens = []; // Выход со всех устройств
    await user.save();

    logger.info(`Admin password changed: ${user.email}`);

    return successResponse(res, null, 'Пароль успешно изменен');
  } catch (error) {
    next(error);
  }
};

/**
 * Получение контента страницы
 * GET /api/v1/settings/pages/:pageId
 */
export const getPageContent = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const savedData = await Settings.getValue(`page_${pageId}`, null);

    if (!savedData) {
      // Возвращаем пустой объект content для визуального редактора
      return successResponse(res, { content: {} });
    }

    // savedData может быть { content: {...} } или просто {...}
    // Нормализуем структуру
    if (savedData.content && typeof savedData.content === 'object') {
      return successResponse(res, savedData);
    }

    // Если сохранён просто объект с элементами, оборачиваем
    return successResponse(res, { content: savedData });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление контента страницы
 * PUT /api/v1/settings/pages/:pageId
 */
export const updatePageContent = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const content = req.body;

    const validPages = ['home', 'index', 'delivery', 'contacts', 'warranty', 'about'];
    if (!validPages.includes(pageId)) {
      return errorResponse(res, 'Некорректный идентификатор страницы', 400);
    }

    await Settings.setValue(`page_${pageId}`, content, {
      type: 'json',
      group: 'pages',
      description: `Контент страницы: ${pageId}`,
    });

    // Очистка кэша
    await deleteCachePattern('settings:*');
    await deleteCachePattern('page:*');

    logger.info(`Page content updated: ${pageId}`);

    return successResponse(res, content, 'Контент страницы сохранен');
  } catch (error) {
    next(error);
  }
};

/**
 * Инициализация дефолтных настроек
 * POST /api/v1/settings/init
 */
export const initDefaultSettings = async (req, res, next) => {
  try {
    const defaultSettings = [
      // Контакты
      { key: 'phone_main', value: '+7 (391) 123-45-67', group: 'contacts', type: 'string', description: 'Основной телефон' },
      { key: 'phone_sales', value: '+7 (391) 987-65-43', group: 'contacts', type: 'string', description: 'Телефон отдела продаж' },
      { key: 'email_main', value: 'info@kmo24.ru', group: 'contacts', type: 'string', description: 'Основной email' },
      { key: 'email_orders', value: 'orders@kmo24.ru', group: 'contacts', type: 'string', description: 'Email для заказов' },
      { key: 'address', value: 'г. Красноярск, ул. Примерная, д. 1', group: 'contacts', type: 'string', description: 'Адрес офиса' },
      { key: 'work_hours', value: 'Пн-Пт: 9:00-18:00, Сб: 10:00-15:00', group: 'contacts', type: 'string', description: 'Часы работы' },
      { key: 'whatsapp', value: '+79001234567', group: 'contacts', type: 'string', description: 'WhatsApp' },
      { key: 'telegram', value: '@kmo24', group: 'contacts', type: 'string', description: 'Telegram' },

      // Общие настройки
      { key: 'site_name', value: 'КМО24', group: 'general', type: 'string', description: 'Название сайта' },
      { key: 'site_description', value: 'Комиссионное медицинское оборудование', group: 'general', type: 'string', description: 'Описание сайта' },

      // SEO
      { key: 'meta_title', value: 'КМО24 - Комиссионное медицинское оборудование в Красноярске', group: 'seo', type: 'string', description: 'Meta title' },
      { key: 'meta_description', value: 'Продажа и покупка медицинского оборудования б/у в Красноярске', group: 'seo', type: 'string', description: 'Meta description' },
    ];

    let created = 0;
    let skipped = 0;

    for (const setting of defaultSettings) {
      const existing = await Settings.findOne({ key: setting.key });
      if (!existing) {
        await Settings.create(setting);
        created++;
      } else {
        skipped++;
      }
    }

    logger.info(`Default settings initialized: ${created} created, ${skipped} skipped`);

    return successResponse(res, { created, skipped }, 'Настройки инициализированы');
  } catch (error) {
    next(error);
  }
};

export default {
  getAllSettings,
  getSettingsByGroup,
  getPublicSettings,
  updateSettings,
  updateSingleSetting,
  changeAdminPassword,
  getPageContent,
  updatePageContent,
  initDefaultSettings,
};
