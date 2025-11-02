/**
 * Утилиты для экспорта данных в различных форматах
 */

/**
 * Экспорт данных в CSV формат
 */
export const exportToCSV = (data: any[], filename: string, columns?: { key: string; label: string }[]) => {
  if (!data || data.length === 0) {
    throw new Error('Нет данных для экспорта');
  }

  // Определяем колонки
  const cols = columns || Object.keys(data[0]).map(key => ({ key, label: key }));

  // Формируем заголовки
  const headers = cols.map(col => escapeCSV(col.label)).join(',');

  // Формируем строки данных
  const rows = data.map(row => {
    return cols.map(col => {
      const value = getNestedValue(row, col.key);
      return escapeCSV(formatValue(value));
    }).join(',');
  });

  // Объединяем всё
  const csv = [headers, ...rows].join('\n');

  // Добавляем BOM для корректного отображения кириллицы в Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });

  downloadFile(blob, `${filename}.csv`);
};

/**
 * Экспорт данных в Excel формат (используя HTML таблицу)
 */
export const exportToExcel = (data: any[], filename: string, columns?: { key: string; label: string }[], title?: string) => {
  if (!data || data.length === 0) {
    throw new Error('Нет данных для экспорта');
  }

  // Определяем колонки
  const cols = columns || Object.keys(data[0]).map(key => ({ key, label: key }));

  // Создаём HTML таблицу
  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
  html += '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->';
  html += '<meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>';
  html += '<style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #4CAF50; color: white; font-weight: bold; }</style>';
  html += '</head><body>';

  if (title) {
    html += `<h2>${title}</h2>`;
  }

  html += '<table>';

  // Заголовки
  html += '<thead><tr>';
  cols.forEach(col => {
    html += `<th>${escapeHTML(col.label)}</th>`;
  });
  html += '</tr></thead>';

  // Данные
  html += '<tbody>';
  data.forEach(row => {
    html += '<tr>';
    cols.forEach(col => {
      const value = getNestedValue(row, col.key);
      html += `<td>${escapeHTML(formatValue(value))}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody>';

  html += '</table></body></html>';

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  downloadFile(blob, `${filename}.xls`);
};

/**
 * Экспорт данных в JSON формат
 */
export const exportToJSON = (data: any[], filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  downloadFile(blob, `${filename}.json`);
};

/**
 * Экспорт данных в XML формат
 */
export const exportToXML = (data: any[], filename: string, rootElement = 'data', itemElement = 'item') => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<${rootElement}>\n`;

  data.forEach(item => {
    xml += `  <${itemElement}>\n`;
    Object.keys(item).forEach(key => {
      const value = item[key];
      xml += `    <${key}>${escapeXML(formatValue(value))}</${key}>\n`;
    });
    xml += `  </${itemElement}>\n`;
  });

  xml += `</${rootElement}>`;

  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
  downloadFile(blob, `${filename}.xml`);
};

/**
 * Экспорт таблицы в PDF (используя печать браузера)
 */
export const exportToPDF = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Элемент не найден');
  }

  // Открываем окно печати
  const printWindow = window.open('', '', 'height=600,width=800');
  if (!printWindow) {
    throw new Error('Не удалось открыть окно печати');
  }

  printWindow.document.write('<html><head><title>' + filename + '</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('body { font-family: Arial, sans-serif; }');
  printWindow.document.write('table { border-collapse: collapse; width: 100%; }');
  printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
  printWindow.document.write('th { background-color: #4CAF50; color: white; }');
  printWindow.document.write('</style>');
  printWindow.document.write('</head><body>');
  printWindow.document.write(element.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();

  // Даём время на загрузку стилей
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

// Вспомогательные функции

/**
 * Экранирование значений для CSV
 */
function escapeCSV(value: string): string {
  if (value === null || value === undefined) return '';

  const stringValue = String(value);

  // Если содержит запятую, кавычки или перенос строки - заключаем в кавычки
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }

  return stringValue;
}

/**
 * Экранирование для HTML
 */
function escapeHTML(value: string): string {
  if (value === null || value === undefined) return '';

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Экранирование для XML
 */
function escapeXML(value: string): string {
  if (value === null || value === undefined) return '';

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Получение вложенного значения по ключу (поддержка точечной нотации)
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Форматирование значения для экспорта
 */
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * Скачивание файла
 */
function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Очистка
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Composable для работы с экспортом
 */
export const useExport = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const exportData = async (
    data: any[],
    format: 'csv' | 'excel' | 'json' | 'xml' | 'pdf',
    filename: string,
    options?: {
      columns?: { key: string; label: string }[];
      title?: string;
      elementId?: string;
    }
  ) => {
    loading.value = true;
    error.value = null;

    try {
      switch (format) {
        case 'csv':
          exportToCSV(data, filename, options?.columns);
          break;
        case 'excel':
          exportToExcel(data, filename, options?.columns, options?.title);
          break;
        case 'json':
          exportToJSON(data, filename);
          break;
        case 'xml':
          exportToXML(data, filename);
          break;
        case 'pdf':
          if (!options?.elementId) {
            throw new Error('Для экспорта в PDF необходимо указать elementId');
          }
          exportToPDF(options.elementId, filename);
          break;
        default:
          throw new Error(`Неподдерживаемый формат: ${format}`);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка при экспорте данных';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    exportData,
    exportToCSV,
    exportToExcel,
    exportToJSON,
    exportToXML,
    exportToPDF,
  };
};
