import express from 'express';
import {
  getAllSettings,
  getSettingsByGroup,
  getPublicSettings,
  updateSettings,
  updateSingleSetting,
  changeAdminPassword,
  getPageContent,
  updatePageContent,
  initDefaultSettings,
} from '../controllers/settings.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Публичные маршруты
router.get('/public', asyncHandler(getPublicSettings));
router.get('/pages/:pageId', asyncHandler(getPageContent));

// Защищённые маршруты (только для админов)
router.use(protect);
router.use(authorize('admin'));

// Получение настроек
router.get('/', asyncHandler(getAllSettings));
router.get('/group/:group', asyncHandler(getSettingsByGroup));

// Обновление настроек
router.put('/group/:group', asyncHandler(updateSettings));
router.put('/single/:key', asyncHandler(updateSingleSetting));

// Обновление контента страниц
router.put('/pages/:pageId', asyncHandler(updatePageContent));

// Изменение пароля админа
router.post('/change-password', asyncHandler(changeAdminPassword));

// Инициализация дефолтных настроек
router.post('/init', asyncHandler(initDefaultSettings));

export default router;
