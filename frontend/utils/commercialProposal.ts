// Commercial Proposal Generator
// Uses jsPDF for PDF generation

import type { Product } from '~/types'

// Logo as base64 for embedding in HTML/PDF
const LOGO_BASE64 = 'data:image/png;base64,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

... [1 lines truncated] ...
'

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

        .logo img {
          max-height: 60px;
          width: auto;
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
          <div class="logo"><img src="${LOGO_BASE64}" alt="КМО24" /></div>
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
