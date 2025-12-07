import Lead from '../models/Lead.js';
import { validatePhone, validateEmail } from '../utils/validators.js';
import config from '../config/index.js';

// Хелперы для лейблов
const getConditionLabel = (condition) => {
  const labels = {
    excellent: 'Отличное',
    good: 'Хорошее',
    normal: 'Нормальное',
    repair: 'Требует ремонта',
  };
  return labels[condition] || condition;
};

const getSubjectLabel = (subject) => {
  const labels = {
    'equipment-selection': 'Подбор оборудования',
    'technical': 'Технические вопросы',
    'delivery': 'Доставка и оплата',
    'warranty': 'Гарантия и сервис',
    'other': 'Другое',
  };
  return labels[subject] || subject;
};

// Отправка уведомления в Telegram
const sendTelegramNotification = async (lead, type = 'callback') => {
  const botToken = config.telegram?.botToken;
  const chatId = process.env.TELEGRAM_LEADS_CHAT_ID || config.telegram?.channelId;

  if (!botToken || !chatId) {
    console.log('Telegram notification skipped: bot token or chat ID not configured');
    return;
  }

  try {
    let message = '';
    const date = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Krasnoyarsk' });
    const crmLink = `${process.env.FRONTEND_URL || 'https://kmo24.ru'}/admin/leads`;

    if (type === 'callback') {
      message = `
🔔 *Новая заявка на обратный звонок*

👤 *Имя:* ${lead.name}
📞 *Телефон:* ${lead.phone}
${lead.message ? `💬 *Сообщение:* ${lead.message}` : ''}
📅 *Дата:* ${date}

🔗 [Открыть в CRM](${crmLink})
      `.trim();
    } else if (type === 'sell') {
      message = `
💰 *Заявка на продажу оборудования*

👤 *Имя:* ${lead.name}
📞 *Телефон:* ${lead.phone}
${lead.email ? `📧 *Email:* ${lead.email}` : ''}
${lead.company ? `🏢 *Компания:* ${lead.company}` : ''}

🔧 *Оборудование:*
${lead.equipmentType ? `• Тип: ${lead.equipmentType}` : ''}
${lead.brand ? `• Марка/модель: ${lead.brand}` : ''}
${lead.condition ? `• Состояние: ${getConditionLabel(lead.condition)}` : ''}
${lead.year ? `• Год выпуска: ${lead.year}` : ''}
${lead.description ? `\n📝 *Описание:* ${lead.description}` : ''}

📅 *Дата:* ${date}
🔗 [Открыть в CRM](${crmLink})
      `.trim();
    } else if (type === 'consultation') {
      message = `
💬 *Заявка на консультацию*

👤 *Имя:* ${lead.name}
📞 *Телефон:* ${lead.phone}
${lead.email ? `📧 *Email:* ${lead.email}` : ''}
${lead.callTime ? `⏰ *Удобное время:* ${lead.callTime}` : ''}

📋 *Тема:* ${getSubjectLabel(lead.subject)}
❓ *Вопрос:* ${lead.question}

📅 *Дата:* ${date}
🔗 [Открыть в CRM](${crmLink})
      `.trim();
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      console.error('Telegram notification failed:', await response.text());
    } else {
      console.log('Telegram notification sent successfully');
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
};

// Получить все лиды с фильтрацией и пагинацией
export const getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      source,
      priority,
      assignedTo,
      search,
      sort = '-createdAt',
      isArchived = false,
    } = req.query;

    // Создаем фильтр
    const filter = { isArchived: isArchived === 'true' };

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Поиск по имени, телефону, email или компании
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const leads = await Lead.find(filter)
      .populate('product', 'name slug price')
      .populate('assignedTo', 'firstName lastName email')
      .sort(sort)
      .limit(limit * 1)
      .skip(skip);

    const total = await Lead.countDocuments(filter);

    res.json({
      success: true,
      data: leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении лидов',
      error: error.message,
    });
  }
};

// Получить лид по ID
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('product', 'name slug price images')
      .populate('assignedTo', 'firstName lastName email phone')
      .populate('interactions.user', 'firstName lastName');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Лид не найден',
      });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении лида',
      error: error.message,
    });
  }
};

// Создать новый лид
export const createLead = async (req, res) => {
  try {
    const leadData = req.body;

    // Валидация телефона
    if (leadData.phone && !validatePhone(leadData.phone)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный формат телефона',
      });
    }

    // Валидация email
    if (leadData.email && !validateEmail(leadData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный формат email',
      });
    }

    // Создаем лид
    const lead = new Lead(leadData);

    // Если это менеджер или админ, может назначить лид себе или другому
    if (req.user.role === 'manager' || req.user.role === 'admin') {
      lead.assignedTo = leadData.assignedTo || req.user._id;
    }

    // Добавляем начальную запись в историю
    lead.interactions.push({
      type: 'note',
      description: 'Лид создан',
      user: req.user._id,
    });

    await lead.save();
    await lead.populate('assignedTo', 'firstName lastName email');

    res.status(201).json({
      success: true,
      data: lead,
      message: 'Лид успешно создан',
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании лида',
      error: error.message,
    });
  }
};

// Обновить лид
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Валидация телефона
    if (updates.phone && !validatePhone(updates.phone)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный формат телефона',
      });
    }

    // Валидация email
    if (updates.email && !validateEmail(updates.email)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный формат email',
      });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Лид не найден',
      });
    }

    // Проверка прав доступа
    if (req.user.role === 'manager' &&
        lead.assignedTo &&
        lead.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'У вас нет прав для редактирования этого лида',
      });
    }

    // Отслеживаем изменение статуса
    if (updates.status && updates.status !== lead.status) {
      lead.interactions.push({
        type: 'note',
        description: `Статус изменен с "${lead.status}" на "${updates.status}"`,
        user: req.user._id,
      });
    }

    // Применяем обновления
    Object.assign(lead, updates);
    await lead.save();

    await lead.populate('assignedTo', 'firstName lastName email');

    res.json({
      success: true,
      data: lead,
      message: 'Лид успешно обновлен',
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении лида',
      error: error.message,
    });
  }
};

// Добавить взаимодействие с лидом
export const addInteraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description } = req.body;

    if (!type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Тип и описание взаимодействия обязательны',
      });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Лид не найден',
      });
    }

    // Проверка прав доступа
    if (req.user.role === 'manager' &&
        lead.assignedTo &&
        lead.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'У вас нет прав для работы с этим лидом',
      });
    }

    lead.interactions.push({
      type,
      description,
      user: req.user._id,
      date: new Date(),
    });

    await lead.save();
    await lead.populate('interactions.user', 'firstName lastName');

    res.json({
      success: true,
      data: lead,
      message: 'Взаимодействие добавлено',
    });
  } catch (error) {
    console.error('Error adding interaction:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при добавлении взаимодействия',
      error: error.message,
    });
  }
};

// Удалить лид (архивировать)
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Лид не найден',
      });
    }

    // Только админ может удалять лиды
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Только администраторы могут удалять лиды',
      });
    }

    // Архивируем лид вместо удаления
    lead.isArchived = true;
    lead.interactions.push({
      type: 'note',
      description: 'Лид архивирован',
      user: req.user._id,
    });

    await lead.save();

    res.json({
      success: true,
      message: 'Лид успешно архивирован',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении лида',
      error: error.message,
    });
  }
};

// Получить статистику по лидам
export const getLeadStats = async (req, res) => {
  try {
    const filter = {};

    // Если менеджер - показываем только его статистику
    if (req.user.role === 'manager') {
      filter.assignedTo = req.user._id;
    }

    const stats = await Lead.getStats(filter);

    // Дополнительная статистика
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLeads = await Lead.countDocuments({
      ...filter,
      createdAt: { $gte: today },
      isArchived: false,
    });

    const overdueLeads = await Lead.countDocuments({
      ...filter,
      nextContactDate: { $lt: new Date() },
      status: { $nin: ['won', 'lost'] },
      isArchived: false,
    });

    // Статистика по источникам
    const sourceStats = await Lead.aggregate([
      { $match: { isArchived: false, ...filter } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
    ]);

    // Статистика по приоритетам
    const priorityStats = await Lead.aggregate([
      { $match: { isArchived: false, ...filter } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        ...stats,
        todayLeads,
        overdueLeads,
        bySource: sourceStats,
        byPriority: priorityStats,
      },
    });
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении статистики',
      error: error.message,
    });
  }
};

// Массовое обновление статуса лидов
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { leadIds, status } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Не указаны ID лидов',
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Не указан новый статус',
      });
    }

    // Проверяем права доступа для каждого лида
    const leads = await Lead.find({ _id: { $in: leadIds } });

    if (req.user.role === 'manager') {
      const hasAccess = leads.every(lead =>
        !lead.assignedTo || lead.assignedTo.toString() === req.user._id.toString()
      );

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'У вас нет прав для изменения некоторых лидов',
        });
      }
    }

    // Обновляем статус и добавляем запись в историю
    for (const lead of leads) {
      const oldStatus = lead.status;
      lead.status = status;
      lead.interactions.push({
        type: 'note',
        description: `Статус изменен с "${oldStatus}" на "${status}" (массовое обновление)`,
        user: req.user._id,
      });
      await lead.save();
    }

    res.json({
      success: true,
      message: `Статус обновлен для ${leads.length} лидов`,
      data: { updatedCount: leads.length },
    });
  } catch (error) {
    console.error('Error bulk updating leads:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при массовом обновлении',
      error: error.message,
    });
  }
};

// Экспорт лидов в CSV
export const exportLeads = async (req, res) => {
  try {
    const filter = { isArchived: false };

    // Если менеджер - экспортируем только его лиды
    if (req.user.role === 'manager') {
      filter.assignedTo = req.user._id;
    }

    const leads = await Lead.find(filter)
      .populate('assignedTo', 'firstName lastName')
      .populate('product', 'name')
      .sort('-createdAt');

    // Формируем CSV
    const csvHeader = 'ID,Имя,Телефон,Email,Компания,Источник,Статус,Приоритет,Менеджер,Продукт,Дата создания\n';

    const csvContent = leads.map(lead => {
      return [
        lead._id,
        lead.name,
        lead.phone || '',
        lead.email || '',
        lead.company || '',
        lead.source || '',
        lead.status,
        lead.priority,
        lead.assignedTo ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}` : '',
        lead.product ? lead.product.name : '',
        lead.createdAt.toLocaleDateString('ru-RU'),
      ].join(',');
    }).join('\n');

    const csv = csvHeader + csvContent;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send('\uFEFF' + csv); // BOM для корректного отображения кириллицы в Excel
  } catch (error) {
    console.error('Error exporting leads:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при экспорте лидов',
      error: error.message,
    });
  }
};

// Публичное создание заявки на обратный звонок (без авторизации)
export const createCallbackRequest = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    // Валидация обязательных полей
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Имя обязательно',
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Телефон обязателен',
      });
    }

    // Валидация телефона
    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный формат телефона',
      });
    }

    // Создаем лид
    const lead = new Lead({
      name: name.trim(),
      phone: phone.trim(),
      message: message?.trim() || '',
      source: 'website',
      status: 'new',
      priority: 'medium',
      tags: ['callback', 'website-form'],
      interactions: [{
        type: 'note',
        description: 'Заявка на обратный звонок с сайта',
      }],
    });

    await lead.save();

    // Отправляем уведомление в Telegram (асинхронно, не блокируя ответ)
    sendTelegramNotification(lead, 'callback').catch(err => {
      console.error('Failed to send Telegram notification:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.',
    });
  } catch (error) {
    console.error('Error creating callback request:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при отправке заявки. Попробуйте позже.',
      error: error.message,
    });
  }
};

// Публичное создание заявки на продажу оборудования (без авторизации)
export const createSellEquipmentRequest = async (req, res) => {
  try {
    const {
      equipmentType,
      brand,
      condition,
      year,
      description,
      name,
      phone,
      email
    } = req.body;

    // Валидация обязательных полей
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Имя обязательно',
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Телефон обязателен',
      });
    }

    if (!equipmentType || !equipmentType.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Тип оборудования обязателен',
      });
    }

    if (!condition) {
      return res.status(400).json({
        success: false,
        message: 'Состояние оборудования обязательно',
      });
    }

    // Валидация телефона
    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный формат телефона',
      });
    }

    // Валидация email если указан
    if (email && !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный формат email',
      });
    }

    // Формируем описание для сообщения лида
    const equipmentInfo = [
      `Тип: ${equipmentType}`,
      brand ? `Марка/модель: ${brand}` : null,
      `Состояние: ${getConditionLabel(condition)}`,
      year ? `Год выпуска: ${year}` : null,
      description ? `Описание: ${description}` : null,
    ].filter(Boolean).join('\n');

    // Создаем лид
    const lead = new Lead({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined,
      message: equipmentInfo,
      source: 'website',
      status: 'new',
      priority: 'high', // Продажа оборудования - высокий приоритет
      tags: ['sell-equipment', 'website-form'],
      interactions: [{
        type: 'note',
        description: `Заявка на продажу оборудования: ${equipmentType}`,
      }],
    });

    await lead.save();

    // Подготовим данные для Telegram с дополнительными полями
    const leadData = {
      ...lead.toObject(),
      equipmentType,
      brand,
      condition,
      year,
      description,
    };

    // Отправляем уведомление в Telegram
    sendTelegramNotification(leadData, 'sell').catch(err => {
      console.error('Failed to send Telegram notification:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Заявка на продажу оборудования успешно отправлена. Мы свяжемся с вами в ближайшее время для оценки.',
    });
  } catch (error) {
    console.error('Error creating sell equipment request:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при отправке заявки. Попробуйте позже.',
      error: error.message,
    });
  }
};

// Публичное создание заявки на консультацию (без авторизации)
export const createConsultationRequest = async (req, res) => {
  try {
    const {
      subject,
      question,
      name,
      phone,
      email,
      callTime
    } = req.body;

    // Валидация обязательных полей
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Имя обязательно',
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Телефон обязателен',
      });
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Тема консультации обязательна',
      });
    }

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Вопрос обязателен',
      });
    }

    // Валидация телефона
    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный формат телефона',
      });
    }

    // Валидация email если указан
    if (email && !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный формат email',
      });
    }

    // Формируем описание для сообщения лида
    const consultInfo = [
      `Тема: ${getSubjectLabel(subject)}`,
      `Вопрос: ${question}`,
      callTime ? `Удобное время для звонка: ${callTime}` : null,
    ].filter(Boolean).join('\n');

    // Создаем лид
    const lead = new Lead({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined,
      message: consultInfo,
      source: 'website',
      status: 'new',
      priority: 'medium',
      tags: ['consultation', 'website-form', subject],
      interactions: [{
        type: 'note',
        description: `Заявка на консультацию: ${getSubjectLabel(subject)}`,
      }],
    });

    await lead.save();

    // Подготовим данные для Telegram с дополнительными полями
    const leadData = {
      ...lead.toObject(),
      subject,
      question,
      callTime,
    };

    // Отправляем уведомление в Telegram
    sendTelegramNotification(leadData, 'consultation').catch(err => {
      console.error('Failed to send Telegram notification:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Заявка на консультацию успешно отправлена. Наш специалист свяжется с вами в ближайшее время.',
    });
  } catch (error) {
    console.error('Error creating consultation request:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при отправке заявки. Попробуйте позже.',
      error: error.message,
    });
  }
};