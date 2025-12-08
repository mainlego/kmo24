import config from '../config/index.js';
import logger from '../utils/logger.js';
import Lead from '../models/Lead.js';

const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

/**
 * Отправка уведомления о новом заказе в Telegram группу
 */
export const sendOrderNotificationToTelegram = async (order) => {
  try {
    const botToken = config.telegram?.botToken;
    const groupId = config.telegram?.notifyGroupId;

    // Детальное логирование для отладки
    logger.info(`Telegram config check - botToken exists: ${!!botToken}, groupId exists: ${!!groupId}`);
    if (botToken) {
      logger.info(`Bot token length: ${botToken.length}, starts with: ${botToken.substring(0, 10)}...`);
    }
    if (groupId) {
      logger.info(`Group ID: ${groupId}`);
    }

    if (!botToken || !groupId) {
      logger.warn('Telegram notifications not configured (missing bot token or group ID)');
      logger.warn(`botToken: ${botToken ? 'SET' : 'NOT SET'}, groupId: ${groupId ? 'SET' : 'NOT SET'}`);
      return { success: false, error: 'Telegram not configured' };
    }

    // Форматирование суммы
    const formatPrice = (price) => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
      }).format(price);
    };

    // Форматирование товаров
    const itemsList = order.items.map((item, i) =>
      `${i + 1}. ${item.name} × ${item.quantity} шт = ${formatPrice(item.total)}`
    ).join('\n');

    // Способ доставки
    const deliveryMethods = {
      pickup: '🏪 Самовывоз',
      dellin: '🚚 Деловые Линии',
      pek: '🚚 ПЭК',
      courier: '🚗 Курьер',
    };
    const deliveryMethod = deliveryMethods[order.shipping?.method] || order.shipping?.method || 'Не указан';

    // Способ оплаты
    const paymentMethods = {
      cash: '💵 Наличные',
      card: '💳 Карта',
      online: '🌐 Онлайн',
      bank_transfer: '🏦 Банковский перевод',
    };
    const paymentMethod = paymentMethods[order.payment?.method] || order.payment?.method || 'Не указан';

    // Формирование сообщения
    const message = `
🛒 <b>Новый заказ #${order.orderNumber}</b>

👤 <b>Клиент:</b>
${order.customer.firstName} ${order.customer.lastName}
📧 ${order.customer.email}
📱 ${order.customer.phone}

📍 <b>Доставка:</b> ${deliveryMethod}
${order.shippingAddress?.city ? `🏙 ${order.shippingAddress.city}` : ''}
${order.shippingAddress?.street ? `📫 ${order.shippingAddress.street}, д.${order.shippingAddress.building || ''}${order.shippingAddress.apartment ? `, кв.${order.shippingAddress.apartment}` : ''}` : ''}

💰 <b>Оплата:</b> ${paymentMethod}

📦 <b>Товары:</b>
${itemsList}

💵 <b>Итого:</b> ${formatPrice(order.pricing?.total || 0)}
${order.pricing?.discount ? `🏷 Скидка: -${formatPrice(order.pricing.discount)}` : ''}
${order.pricing?.shipping ? `🚚 Доставка: ${formatPrice(order.pricing.shipping)}` : ''}

${order.customerComment ? `📝 Комментарий: ${order.customerComment}` : ''}
${order.isGuest ? '👤 Гостевой заказ' : ''}
`;

    const telegramUrl = `${TELEGRAM_API_URL}${botToken}/sendMessage`;
    logger.info(`Sending Telegram message to: ${telegramUrl.replace(botToken, 'BOT_TOKEN_HIDDEN')}`);

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: groupId,
        text: message.trim(),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    logger.info(`Telegram API response status: ${response.status}`);
    const result = await response.json();
    logger.info(`Telegram API response: ${JSON.stringify(result)}`);

    if (!result.ok) {
      logger.error('Telegram notification error:', result);
      return { success: false, error: result.description };
    }

    logger.info(`Order notification sent to Telegram: ${order.orderNumber}`);
    return { success: true, messageId: result.result.message_id };
  } catch (error) {
    logger.error('Error sending Telegram notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Создание лида в CRM при новом заказе
 */
export const createLeadInCRM = async (order) => {
  try {
    if (!config.crm?.enabled) {
      logger.info('CRM integration disabled');
      return { success: false, error: 'CRM disabled' };
    }

    const provider = config.crm.provider;

    switch (provider) {
      case 'amocrm':
        return await createAmoCRMLead(order);
      case 'bitrix24':
        return await createBitrix24Lead(order);
      default:
        return await createCustomCRMLead(order);
    }
  } catch (error) {
    logger.error('Error creating CRM lead:', error);
    return { success: false, error: error.message };
  }
};

/**
 * AmoCRM интеграция
 */
const createAmoCRMLead = async (order) => {
  try {
    const { apiUrl, apiKey } = config.crm;

    if (!apiUrl || !apiKey) {
      return { success: false, error: 'AmoCRM not configured' };
    }

    // Форматирование суммы
    const totalAmount = order.pricing?.total || 0;

    // Формирование данных лида
    const leadData = {
      name: `Заказ #${order.orderNumber}`,
      price: totalAmount,
      pipeline_id: parseInt(config.crm.pipelineId) || undefined,
      status_id: parseInt(config.crm.statusId) || undefined,
      custom_fields_values: [
        {
          field_code: 'PHONE',
          values: [{ value: order.customer.phone }],
        },
        {
          field_code: 'EMAIL',
          values: [{ value: order.customer.email }],
        },
      ],
      _embedded: {
        contacts: [
          {
            name: `${order.customer.firstName} ${order.customer.lastName}`,
            custom_fields_values: [
              {
                field_code: 'PHONE',
                values: [{ value: order.customer.phone, enum_code: 'WORK' }],
              },
              {
                field_code: 'EMAIL',
                values: [{ value: order.customer.email, enum_code: 'WORK' }],
              },
            ],
          },
        ],
      },
    };

    const response = await fetch(`${apiUrl}/api/v4/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify([leadData]),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error('AmoCRM error:', result);
      return { success: false, error: result.detail || 'AmoCRM error' };
    }

    const leadId = result._embedded?.leads?.[0]?.id;
    logger.info(`Lead created in AmoCRM: ${leadId} for order ${order.orderNumber}`);

    return { success: true, leadId, provider: 'amocrm' };
  } catch (error) {
    logger.error('AmoCRM integration error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Bitrix24 интеграция
 */
const createBitrix24Lead = async (order) => {
  try {
    const { apiUrl } = config.crm;

    if (!apiUrl) {
      return { success: false, error: 'Bitrix24 not configured' };
    }

    // Товары для описания
    const itemsDescription = order.items.map((item, i) =>
      `${i + 1}. ${item.name} × ${item.quantity} шт`
    ).join('\n');

    const leadData = {
      TITLE: `Заказ #${order.orderNumber}`,
      NAME: order.customer.firstName,
      LAST_NAME: order.customer.lastName,
      PHONE: [{ VALUE: order.customer.phone, VALUE_TYPE: 'WORK' }],
      EMAIL: [{ VALUE: order.customer.email, VALUE_TYPE: 'WORK' }],
      OPPORTUNITY: order.pricing?.total || 0,
      CURRENCY_ID: 'RUB',
      COMMENTS: `Заказ #${order.orderNumber}\n\nТовары:\n${itemsDescription}\n\nКомментарий: ${order.customerComment || 'нет'}`,
      SOURCE_ID: 'WEB',
      ADDRESS_CITY: order.shippingAddress?.city || '',
    };

    // Bitrix24 webhook URL format: https://your-domain.bitrix24.ru/rest/1/webhooktoken/crm.lead.add
    const response = await fetch(`${apiUrl}/crm.lead.add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: leadData }),
    });

    const result = await response.json();

    if (result.error) {
      logger.error('Bitrix24 error:', result);
      return { success: false, error: result.error_description || result.error };
    }

    const leadId = result.result;
    logger.info(`Lead created in Bitrix24: ${leadId} for order ${order.orderNumber}`);

    return { success: true, leadId, provider: 'bitrix24' };
  } catch (error) {
    logger.error('Bitrix24 integration error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Создание лида во внутренней CRM (модель Lead)
 * Это для Kanban-доски в админ-панели
 */
export const createInternalLead = async (order) => {
  try {
    // Форматирование товаров для сообщения
    const itemsList = order.items.map((item, i) =>
      `${i + 1}. ${item.name} × ${item.quantity} шт`
    ).join('\n');

    // Способы доставки
    const deliveryMethods = {
      pickup: 'Самовывоз',
      dellin: 'Деловые Линии',
      pek: 'ПЭК',
      courier: 'Курьер',
    };
    const deliveryMethod = deliveryMethods[order.shipping?.method] || order.shipping?.method || 'Не указан';

    // Формируем сообщение с деталями заказа
    const message = `Заказ #${order.orderNumber}

Товары:
${itemsList}

Доставка: ${deliveryMethod}
${order.shippingAddress?.city ? `Город: ${order.shippingAddress.city}` : ''}
${order.shippingAddress?.street ? `Адрес: ${order.shippingAddress.street}, д.${order.shippingAddress.building || ''}${order.shippingAddress.apartment ? `, кв.${order.shippingAddress.apartment}` : ''}` : ''}

${order.customerComment ? `Комментарий: ${order.customerComment}` : ''}`.trim();

    // Создаём Lead
    const lead = new Lead({
      name: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
      phone: order.customer.phone,
      email: order.customer.email || '',
      source: 'website',
      status: 'new',
      message: message,
      budget: order.pricing?.total || 0,
      tags: ['заказ', `#${order.orderNumber}`],
      priority: 'high', // Заказы имеют высокий приоритет
      metadata: {
        orderId: order._id?.toString(),
        orderNumber: order.orderNumber,
        isGuest: order.isGuest || false,
      },
    });

    await lead.save();

    logger.info(`Internal lead created for order ${order.orderNumber}, lead ID: ${lead._id}`);
    return { success: true, leadId: lead._id, provider: 'internal' };
  } catch (error) {
    logger.error('Error creating internal lead:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Custom CRM (универсальный webhook)
 */
const createCustomCRMLead = async (order) => {
  try {
    const { apiUrl, apiKey } = config.crm;

    if (!apiUrl) {
      return { success: false, error: 'Custom CRM not configured' };
    }

    const leadData = {
      order_number: order.orderNumber,
      customer: {
        name: `${order.customer.firstName} ${order.customer.lastName}`,
        email: order.customer.email,
        phone: order.customer.phone,
      },
      items: order.items.map(item => ({
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      shipping: {
        method: order.shipping?.method,
        address: order.shippingAddress,
        cost: order.pricing?.shipping || 0,
      },
      payment: {
        method: order.payment?.method,
        status: order.payment?.status,
      },
      total: order.pricing?.total || 0,
      discount: order.pricing?.discount || 0,
      comment: order.customerComment,
      is_guest: order.isGuest,
      created_at: order.createdAt,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(leadData),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error('Custom CRM error:', result);
      return { success: false, error: result.message || 'CRM error' };
    }

    logger.info(`Lead sent to custom CRM for order ${order.orderNumber}`);
    return { success: true, provider: 'custom', response: result };
  } catch (error) {
    logger.error('Custom CRM integration error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Отправка всех уведомлений о новом заказе
 */
export const sendNewOrderNotifications = async (order) => {
  const results = {
    telegram: null,
    crm: null,
    internalLead: null,
  };

  // Отправка в Telegram (асинхронно, не блокируем основной процесс)
  try {
    results.telegram = await sendOrderNotificationToTelegram(order);
  } catch (error) {
    logger.error('Telegram notification failed:', error);
    results.telegram = { success: false, error: error.message };
  }

  // Создание лида во внутренней CRM (Kanban)
  try {
    results.internalLead = await createInternalLead(order);
  } catch (error) {
    logger.error('Internal lead creation failed:', error);
    results.internalLead = { success: false, error: error.message };
  }

  // Создание лида во внешней CRM (если настроена)
  try {
    results.crm = await createLeadInCRM(order);
  } catch (error) {
    logger.error('External CRM lead creation failed:', error);
    results.crm = { success: false, error: error.message };
  }

  return results;
};

export default {
  sendOrderNotificationToTelegram,
  createLeadInCRM,
  createInternalLead,
  sendNewOrderNotifications,
};
