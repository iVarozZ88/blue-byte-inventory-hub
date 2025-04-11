
import { Asset } from '@/lib/db';

export const exportToPDF = (assets: Asset[], title: string) => {
  // Create a new window for the printable content
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita las ventanas emergentes para generar el PDF.');
    return;
  }

  // Format current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES');

  // Create status label function
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'assigned': return 'Asignado';
      case 'maintenance': return 'Mantenimiento';
      case 'retired': return 'Retirado';
      default: return status;
    }
  };

  // Create type label function
  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      computer: 'Computadora',
      laptop: 'Portátil',
      monitor: 'Monitor',
      mouse: 'Ratón',
      keyboard: 'Teclado',
      telephone: 'Teléfono',
      mobile: 'Móvil',
      scanner: 'Escáner',
      printer: 'Impresora',
      cable: 'Cable',
      other: 'Otro'
    };
    return typeLabels[type] || type;
  };

  // Generate table rows for assets
  const assetRows = assets.map(asset => `
    <tr>
      <td>${asset.name}</td>
      <td>${getTypeLabel(asset.type)}</td>
      <td>${asset.model || '-'}</td>
      <td>${asset.serialNumber || '-'}</td>
      <td>${getStatusLabel(asset.status)}</td>
      <td>${asset.assignedTo || '-'}</td>
      <td>${asset.lastUpdated}</td>
    </tr>
  `).join('');

  // Define HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Inventario Tech</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          line-height: 1.4;
          padding: 20px;
          color: #333;
        }
        .header {
          margin-bottom: 30px;
          text-align: center;
        }
        h1 {
          margin: 0 0 10px;
          font-size: 24px;
        }
        .date {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }
        .summary {
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 12px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        @media print {
          body {
            padding: 0;
            font-size: 12px;
          }
          table {
            font-size: 10px;
          }
          .no-print {
            display: none;
          }
          @page {
            margin: 1.5cm;
          }
        }
        .print-button {
          margin-top: 20px;
          padding: 10px 20px;
          background: #4285F4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Inventario Tech - ${title}</h1>
        <div class="date">Generado el: ${formattedDate}</div>
      </div>
      
      <div class="summary">
        <strong>Total de activos:</strong> ${assets.length}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Modelo</th>
            <th>Nº Serie</th>
            <th>Estado</th>
            <th>Asignado A</th>
            <th>Últ. Actualización</th>
          </tr>
        </thead>
        <tbody>
          ${assetRows}
        </tbody>
      </table>

      <div class="no-print" style="text-align: center;">
        <button class="print-button" onclick="window.print(); return false;">Imprimir PDF</button>
      </div>
    </body>
    </html>
  `;

  // Write content to the new window
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
