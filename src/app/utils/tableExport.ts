export interface ColumnDef<T> {
  id: string;
  label: string;
  accessor: (item: T) => string | number;
}

/**
 * Export data to a CSV file
 */
export function exportToCSV<T>(filename: string, columns: ColumnDef<T>[], data: T[]) {
  const headers = columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(',');
  const rows = data.map((item) =>
    columns
      .map((c) => {
        const val = c.accessor(item);
        const str = val === undefined || val === null ? '' : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to a native Excel spreadsheet file (.xls)
 */
export function exportToExcel<T>(filename: string, columns: ColumnDef<T>[], data: T[]) {
  const headers = columns
    .map(
      (c) =>
        `<th style="background-color:#1e1b4b;color:#ffffff;border:1px solid #312e81;padding:10px;text-align:left;font-family:Arial,sans-serif;font-size:12px;">${c.label}</th>`
    )
    .join('');

  const rows = data
    .map(
      (item, idx) =>
        `<tr style="background-color:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">${columns
          .map((c) => {
            const val = c.accessor(item);
            const str = val === undefined || val === null ? '' : String(val);
            return `<td style="border:1px solid #e2e8f0;padding:8px 10px;font-family:Arial,sans-serif;font-size:12px;color:#1e293b;">${str}</td>`;
          })
          .join('')}</tr>`
    )
    .join('');

  const template = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${filename}</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
    </head>
    <body>
      <h2 style="font-family:Arial,sans-serif;color:#1e1b4b;margin-bottom:12px;">RANGPUR BIKE - ${filename}</h2>
      <table border="1" style="border-collapse:collapse;font-family:Arial,sans-serif;">
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + template], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Open print-friendly window for printing or saving as PDF
 */
export function printTable<T>(title: string, columns: ColumnDef<T>[], data: T[]) {
  const printWindow = window.open('', '_blank', 'width=950,height=700');
  if (!printWindow) {
    alert('Please allow pop-ups to print this document.');
    return;
  }

  const headers = columns
    .map(
      (c) =>
        `<th style="border:1px solid #cbd5e1;padding:10px 12px;background:#f1f5f9;color:#0f172a;font-weight:700;text-align:left;font-size:12px;">${c.label}</th>`
    )
    .join('');

  const rows =
    data.length > 0
      ? data
          .map(
            (item, idx) =>
              `<tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">${columns
                .map((c) => {
                  const val = c.accessor(item);
                  const str = val === undefined || val === null ? '' : String(val);
                  return `<td style="border:1px solid #e2e8f0;padding:8px 12px;font-size:12px;color:#334155;">${str}</td>`;
                })
                .join('')}</tr>`
          )
          .join('')
      : `<tr><td colspan="${columns.length}" style="text-align:center;padding:20px;color:#64748b;font-size:12px;">No data available</td></tr>`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title} - RANGPUR BIKE</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            padding: 30px; 
            color: #0f172a; 
            margin: 0;
            background: #fff;
          }
          .header-container { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            margin-bottom: 24px; 
            border-bottom: 2px solid #6366f1; 
            padding-bottom: 16px; 
          }
          .brand-title { 
            font-size: 22px; 
            font-weight: 800; 
            color: #312e81; 
            letter-spacing: -0.5px;
          }
          .report-subtitle { 
            font-size: 13px; 
            color: #475569; 
            margin-top: 4px; 
            font-weight: 500;
          }
          .report-meta { 
            font-size: 11px; 
            color: #64748b; 
            text-align: right; 
            line-height: 1.6;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 12px; 
          }
          .footer {
            margin-top: 30px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body { padding: 0; }
            @page { margin: 1cm; size: landscape; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <div>
            <div class="brand-title">RANGPUR BIKE</div>
            <div class="report-subtitle">${title}</div>
          </div>
          <div class="report-meta">
            <div><strong>Generated:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
            <div><strong>Total Records:</strong> ${data.length}</div>
          </div>
        </div>
        <table>
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="footer">
          <span>DATABYTE - POS Enterprise System</span>
          <span>Confidential</span>
        </div>
        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Export to PDF (triggers printable layout ready to save as PDF)
 */
export function exportToPDF<T>(title: string, columns: ColumnDef<T>[], data: T[]) {
  printTable(title, columns, data);
}
