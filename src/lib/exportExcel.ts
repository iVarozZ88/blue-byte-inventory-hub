
import { Asset } from '@/lib/db';

export const exportToExcel = (assets: Asset[], title: string) => {
  // Format current date for filename
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  const filename = `${title.replace(/\s+/g, '_')}_${dateStr}.csv`;

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

  // CSV header
  const csvContent = [
    ['Nombre', 'Tipo', 'Modelo', 'Número de Serie', 'Estado', 'Asignado A', 'Última Actualización', 'Notas']
      .map(field => `"${field}"`)
      .join(',')
  ];

  // Add asset rows
  assets.forEach(asset => {
    const row = [
      asset.name,
      getTypeLabel(asset.type),
      asset.model || '',
      asset.serialNumber || '',
      getStatusLabel(asset.status),
      asset.assignedTo || '',
      asset.lastUpdated,
      asset.notes || ''
    ]
      .map(field => `"${String(field).replace(/"/g, '""')}"`)
      .join(',');
    
    csvContent.push(row);
  });

  // Create CSV content
  const csvString = csvContent.join('\n');
  
  // Create a Blob and download link
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create download link and trigger download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
