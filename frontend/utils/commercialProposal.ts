// Commercial Proposal Generator
// Uses jsPDF for PDF generation

import type { Product } from '~/types'

export interface ProposalProduct {
  product: Product
  quantity: number
}

export interface ProposalData {
  companyName: string
  companyInn?: string
  contactPerson: string
  phone: string
  email?: string
  products: ProposalProduct[]
  validUntil: Date
  notes?: string
}

export interface ProposalResult {
  pdfBlob: Blob
  pdfUrl: string
  proposalNumber: string
}

// Generate unique proposal number
export const generateProposalNumber = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `КП-${year}${month}${day}-${random}`
}

// Format price for display
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price)
}

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

// Generate HTML template for commercial proposal
export const generateProposalHTML = (data: ProposalData, proposalNumber: string): string => {
  const currentDate = new Date()

  const totalAmount = data.products.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)

  const productsTableRows = data.products.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>
        <strong>${item.product.name}</strong>
        ${item.product.sku ? `<br><small>Артикул: ${item.product.sku}</small>` : ''}
      </td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">${formatPrice(item.product.price)}</td>
      <td style="text-align: right;"><strong>${formatPrice(item.product.price * item.quantity)}</strong></td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 40px;
          color: #333;
          line-height: 1.6;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          border-bottom: 3px solid #f59e0b;
          padding-bottom: 20px;
        }

        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #f59e0b;
        }

        .logo-subtitle {
          font-size: 14px;
          color: #666;
          margin-top: 5px;
        }

        .company-info {
          text-align: right;
          font-size: 12px;
          color: #666;
        }

        .proposal-title {
          text-align: center;
          margin: 40px 0;
        }

        .proposal-title h1 {
          font-size: 28px;
          color: #1f2937;
          margin: 0;
        }

        .proposal-title .number {
          font-size: 16px;
          color: #f59e0b;
          margin-top: 10px;
        }

        .meta-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
        }

        .meta-block h3 {
          margin: 0 0 10px;
          font-size: 14px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .meta-block p {
          margin: 5px 0;
          font-size: 14px;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        .products-table th {
          background: #f59e0b;
          color: white;
          padding: 12px;
          text-align: left;
          font-size: 14px;
        }

        .products-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }

        .products-table tr:nth-child(even) {
          background: #f9fafb;
        }

        .total-section {
          text-align: right;
          margin-bottom: 40px;
        }

        .total-amount {
          font-size: 24px;
          font-weight: bold;
          color: #f59e0b;
          margin: 10px 0;
        }

        .total-label {
          font-size: 16px;
          color: #6b7280;
        }

        .validity {
          background: #fef3c7;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #f59e0b;
          margin-bottom: 30px;
        }

        .validity h4 {
          margin: 0 0 5px;
          color: #92400e;
        }

        .notes {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .notes h4 {
          margin: 0 0 10px;
          color: #374151;
        }

        .terms {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 40px;
        }

        .terms h4 {
          font-size: 14px;
          color: #374151;
          margin: 0 0 10px;
        }

        .terms ul {
          margin: 0;
          padding-left: 20px;
        }

        .terms li {
          margin-bottom: 5px;
        }

        .signature {
          margin-top: 60px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }

        .signature-line {
          display: inline-block;
          width: 200px;
          border-bottom: 1px solid #333;
          margin-right: 10px;
        }

        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 11px;
          color: #9ca3af;
        }

        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">КМО24</div>
          <div class="logo-subtitle">Комиссионное медицинское оборудование</div>
        </div>
        <div class="company-info">
          <p><strong>ООО "КМО24"</strong></p>
          <p>ИНН: 2465123456</p>
          <p>г. Красноярск, ул. Павлова, 55</p>
          <p>Тел: +7 (902) 923-97-04</p>
          <p>Email: info@kmo24.ru</p>
        </div>
      </div>

      <div class="proposal-title">
        <h1>КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</h1>
        <div class="number">${proposalNumber}</div>
      </div>

      <div class="meta-info">
        <div class="meta-block">
          <h3>Получатель</h3>
          <p><strong>${data.companyName}</strong></p>
          ${data.companyInn ? `<p>ИНН: ${data.companyInn}</p>` : ''}
          <p>Контактное лицо: ${data.contactPerson}</p>
          <p>Телефон: ${data.phone}</p>
          ${data.email ? `<p>Email: ${data.email}</p>` : ''}
        </div>
        <div class="meta-block">
          <h3>Дата</h3>
          <p>${formatDate(currentDate)}</p>
        </div>
      </div>

      <table class="products-table">
        <thead>
          <tr>
            <th style="width: 40px;">№</th>
            <th>Наименование товара</th>
            <th style="width: 80px; text-align: center;">Кол-во</th>
            <th style="width: 120px; text-align: right;">Цена</th>
            <th style="width: 120px; text-align: right;">Сумма</th>
          </tr>
        </thead>
        <tbody>
          ${productsTableRows}
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-label">Итого:</div>
        <div class="total-amount">${formatPrice(totalAmount)}</div>
        <div style="font-size: 12px; color: #666;">НДС не облагается</div>
      </div>

      <div class="validity">
        <h4>Срок действия предложения</h4>
        <p>Данное коммерческое предложение действительно до <strong>${formatDate(data.validUntil)}</strong></p>
      </div>

      ${data.notes ? `
        <div class="notes">
          <h4>Примечания</h4>
          <p>${data.notes}</p>
        </div>
      ` : ''}

      <div class="terms">
        <h4>Условия</h4>
        <ul>
          <li>Оплата: 100% предоплата или по договоренности</li>
          <li>Доставка: За счет покупателя (возможен расчет стоимости)</li>
          <li>Гарантия: 6 месяцев на все оборудование</li>
          <li>Возврат: В течение 14 дней при сохранении товарного вида</li>
          <li>Оборудование б/у, прошедшее техническую проверку</li>
        </ul>
      </div>

      <div class="signature">
        <p>С уважением,</p>
        <p>Менеджер по продажам</p>
        <p style="margin-top: 30px;">
          <span class="signature-line"></span> / ________________
        </p>
      </div>

      <div class="footer">
        <p>КМО24 - Надежный партнер в поставках комиссионного оборудования</p>
        <p>www.kmo24.ru | +7 (902) 923-97-04 | info@kmo24.ru</p>
      </div>
    </body>
    </html>
  `
}

// Generate PDF from HTML using browser's print function
export const generateProposalPDF = async (data: ProposalData): Promise<ProposalResult> => {
  const proposalNumber = generateProposalNumber()
  const html = generateProposalHTML(data, proposalNumber)

  // Create a blob from HTML
  const htmlBlob = new Blob([html], { type: 'text/html' })
  const htmlUrl = URL.createObjectURL(htmlBlob)

  // For now, we'll return the HTML as a printable document
  // In production, you would use a library like jsPDF or html2pdf.js
  return {
    pdfBlob: htmlBlob,
    pdfUrl: htmlUrl,
    proposalNumber,
  }
}

// Open proposal in new window for printing
export const printProposal = (proposalUrl: string): void => {
  const printWindow = window.open(proposalUrl, '_blank')
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}

// Download proposal as HTML (can be saved as PDF by user)
export const downloadProposal = (html: string, proposalNumber: string): void => {
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${proposalNumber}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
