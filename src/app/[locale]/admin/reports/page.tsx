'use client';

import { useState } from 'react';
import { Search, MoreVertical, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface Report {
  id: string;
  reportID: string;
  type: 'Producto' | 'Tienda' | 'Reseña' | 'Usuario';
  reportedItem: string;
  reporter: string;
  reason: string;
  date: string;
  status: 'Pendiente' | 'En revisión' | 'Resuelto';
}

const mockReports: Report[] = [
  {
    id: '1',
    reportID: 'REP-001',
    type: 'Producto',
    reportedItem: 'Laptop Gaming ASUS ROG',
    reporter: 'Juan García',
    reason: 'Producto falsificado',
    date: '2025-03-10',
    status: 'Pendiente',
  },
  {
    id: '2',
    reportID: 'REP-002',
    type: 'Tienda',
    reportedItem: 'TechPro Store',
    reporter: 'María López',
    reason: 'Estafa y productos de mala calidad',
    date: '2025-03-11',
    status: 'En revisión',
  },
  {
    id: '3',
    reportID: 'REP-003',
    type: 'Reseña',
    reportedItem: 'Reseña del producto XYZ',
    reporter: 'Carlos Martínez',
    reason: 'Contenido inapropiado',
    date: '2025-03-09',
    status: 'Resuelto',
  },
  {
    id: '4',
    reportID: 'REP-004',
    type: 'Usuario',
    reportedItem: 'Usuario123',
    reporter: 'Ana Rodríguez',
    reason: 'Comportamiento acosador',
    date: '2025-03-12',
    status: 'En revisión',
  },
  {
    id: '5',
    reportID: 'REP-005',
    type: 'Producto',
    reportedItem: 'Auriculares Bluetooth Pro',
    reporter: 'Pedro Sánchez',
    reason: 'No corresponde a la descripción',
    date: '2025-03-13',
    status: 'Pendiente',
  },
];

type TypeFilter = 'Todos' | 'Producto' | 'Tienda' | 'Reseña' | 'Usuario';

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Todos');
  const [reports] = useState(mockReports);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reportID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === 'Todos' || report.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Producto':
        return 'bg-blue-50 text-blue-700';
      case 'Tienda':
        return 'bg-[#0066FF]/10 text-[#0066FF]';
      case 'Reseña':
        return 'bg-orange-100 text-orange-800';
      case 'Usuario':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-amber-50 text-amber-700';
      case 'En revisión':
        return 'bg-blue-50 text-blue-700';
      case 'Resuelto':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resuelto':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'En revisión':
        return <Clock className="h-4 w-4" />;
      case 'Pendiente':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Reporte de Denuncias
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Total: {filteredReports.length} reportes
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por ID, elemento o reporter..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Todos', 'Producto', 'Tienda', 'Reseña', 'Usuario'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTypeFilter(filter as TypeFilter)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                typeFilter === filter
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300:bg-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                ID Reporte
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Elemento Reportado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Reporter
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Razón
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  {report.reportID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                      report.type
                    )}`}
                  >
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {report.reportedItem}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {report.reporter}
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm max-w-xs">
                  <span className="truncate">{report.reason}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                  {new Date(report.date).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {getStatusIcon(report.status)}
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
