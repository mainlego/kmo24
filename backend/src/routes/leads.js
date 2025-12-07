import express from 'express';
import * as leadsController from '../controllers/leads.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { publicFormsLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Публичные маршруты (без авторизации) - с rate limiting для защиты от спама
router.post('/callback', publicFormsLimiter, asyncHandler(leadsController.createCallbackRequest));
router.post('/sell-equipment', publicFormsLimiter, asyncHandler(leadsController.createSellEquipmentRequest));
router.post('/consultation', publicFormsLimiter, asyncHandler(leadsController.createConsultationRequest));

// Все остальные маршруты требуют аутентификации
router.use(protect);

// Маршруты доступные для менеджеров и админов
router.use(authorize('manager', 'admin'));

// Получить статистику лидов
router.get('/stats', asyncHandler(leadsController.getLeadStats));

// Экспорт лидов в CSV
router.get('/export', asyncHandler(leadsController.exportLeads));

// Получить все лиды
router.get('/', asyncHandler(leadsController.getLeads));

// Получить лид по ID
router.get('/:id', asyncHandler(leadsController.getLeadById));

// Создать новый лид
router.post('/', asyncHandler(leadsController.createLead));

// Массовое обновление статуса
router.post('/bulk-status', asyncHandler(leadsController.bulkUpdateStatus));

// Обновить лид
router.put('/:id', asyncHandler(leadsController.updateLead));

// Добавить взаимодействие
router.post('/:id/interactions', asyncHandler(leadsController.addInteraction));

// Удалить (архивировать) лид
router.delete('/:id', asyncHandler(leadsController.deleteLead));

export default router;