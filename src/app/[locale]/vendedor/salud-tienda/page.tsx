'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';

const ZONE_COLORS: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', ring: 'ring-green-500' },
  yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', ring: 'ring-yellow-500' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', ring: 'ring-orange-500' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', ring: 'ring-red-500' },
  critical: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/50', ring: 'ring-red-500' },
};

interface HealthData {
  overallScore: number;
  penaltyLevel: {
    zone: string;
    labelEs: string;
  };
  metrics: {
    responseRate: number;
    avgResponseTimeHours: number;
    onTimeShippingRate: number;
    incidentRate: number;
    resolutionRate: number;
    cancellationRate: number;
    avgRating: number;
  };
  penalties: {
    totalPoints: number;
    activePenalties: number;
  };
  totalOrders: number;
}

interface Penalty {
  id: string;
  type: string;
  status: string;
  reason: string;
  points: number;
  createdAt: string;
  expiresAt: string | null;
  appealedAt: string | null;
}

export default function StoreHealthPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [health, setHealth] = useState<HealthData | null>(null);
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/v2/vendedor/salud');
        if (res.ok) {
          const data = await res.json();
          if (data.overallScore !== undefined) setHealth(data);
          if (data.penaltyHistory) setPenalties(data.penaltyHistory);
        }
      } catch {
        console.error('Error fetching health data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const MetricCard = ({ label, value, suffix, good, threshold }: {
    label: string; value: number; suffix: string; good: 'high' | 'low'; threshold: number;
  }) => {
    const isGood = good === 'high' ? value >= threshold : value <= threshold;
    return (
      <div className="bg-white border border-gray-300 rounded-xl p-4">
        <p className="text-xs text-[#4A4A4A] mb-1">{label}</p>
        <p className={`text-2xl font-bold ${isGood ? 'text-green-400' : 'text-orange-400'}`}>
          {value}{suffix}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-700 rounded w-1/3" />
        <div className="h-48 bg-white rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-xl" />)}
        </div>
      </div>
    );
  }

  // Default data if no health score yet
  const data = health || {
    overallScore: 100,
    penaltyLevel: { zone: 'green', labelEs: 'Buen estado' },
    metrics: { responseRate: 100, avgResponseTimeHours: 0, onTimeShippingRate: 100, incidentRate: 0, resolutionRate: 100, cancellationRate: 0, avgRating: 0 },
    penalties: { totalPoints: 0, activePenalties: 0 },
    totalOrders: 0,
  };

  const zone = data.penaltyLevel.zone;
  const colors = ZONE_COLORS[zone] || ZONE_COLORS.green;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Salud de la Tienda</h1>
        <p className="text-[#4A4A4A] text-sm mt-1">
          Monitoriza el rendimiento y estado de tu tienda
        </p>
      </div>

      {/* Overall Score */}
      <div className={`${colors.bg} border ${colors.border} rounded-xl p-8 text-center`}>
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-current mb-4" style={{ borderColor: zone === 'green' ? '#22c55e' : zone === 'yellow' ? '#eab308' : zone === 'orange' ? '#f97316' : '#ef4444' }}>
          <div>
            <p className={`text-4xl font-bold ${colors.text}`}>{data.overallScore}</p>
            <p className="text-xs text-[#4A4A4A]">/100</p>
          </div>
        </div>
        <h2 className={`text-xl font-bold ${colors.text}`}>{data.penaltyLevel.labelEs}</h2>
        <p className="text-sm text-[#4A4A4A] mt-2">
          {data.penalties.totalPoints} puntos de penalización | {data.penalties.activePenalties} penalizaciones activas
        </p>
        <p className="text-xs text-gray-500 mt-1">Basado en los últimos 90 días | {data.totalOrders} pedidos evaluados</p>
      </div>

      {/* Metrics Grid */}
      <div>
        <h2 className="text-lg font-medium text-black mb-3">Métricas de Rendimiento</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Tasa de respuesta" value={data.metrics.responseRate} suffix="%" good="high" threshold={90} />
          <MetricCard label="Tiempo medio respuesta" value={data.metrics.avgResponseTimeHours} suffix="h" good="low" threshold={24} />
          <MetricCard label="Envíos a tiempo" value={data.metrics.onTimeShippingRate} suffix="%" good="high" threshold={90} />
          <MetricCard label="Tasa de incidencias" value={data.metrics.incidentRate} suffix="%" good="low" threshold={10} />
          <MetricCard label="Tasa de resolución" value={data.metrics.resolutionRate} suffix="%" good="high" threshold={80} />
          <MetricCard label="Tasa de cancelación" value={data.metrics.cancellationRate} suffix="%" good="low" threshold={5} />
          <MetricCard label="Valoración media" value={data.metrics.avgRating} suffix="/5" good="high" threshold={3.5} />
          <div className="bg-white border border-gray-300 rounded-xl p-4">
            <p className="text-xs text-[#4A4A4A] mb-1">Pedidos totales (90d)</p>
            <p className="text-2xl font-bold text-black">{data.totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Penalty Scale */}
      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <h2 className="text-lg font-medium text-black mb-4">Escala de Penalizaciones</h2>
        <div className="space-y-3">
          {[
            { zone: 'green', label: '0-10 puntos', desc: 'Buen estado - Sin restricciones', range: [0, 10] },
            { zone: 'yellow', label: '11-25 puntos', desc: 'Advertencias formales', range: [11, 25] },
            { zone: 'orange', label: '26-50 puntos', desc: 'Reducción de visibilidad + comisión extra', range: [26, 50] },
            { zone: 'red', label: '51-75 puntos', desc: 'Suspensión temporal (7-30 días)', range: [51, 75] },
            { zone: 'critical', label: '76+ puntos', desc: 'Suspensión permanente', range: [76, 100] },
          ].map((level) => {
            const isActive = data.penalties.totalPoints >= level.range[0] && data.penalties.totalPoints <= level.range[1];
            const zoneColors = ZONE_COLORS[level.zone];
            return (
              <div key={level.zone} className={`flex items-center gap-4 p-3 rounded-lg ${isActive ? zoneColors.bg + ' border ' + zoneColors.border : ''}`}>
                <div className={`w-3 h-3 rounded-full ${
                  level.zone === 'green' ? 'bg-green-500' :
                  level.zone === 'yellow' ? 'bg-yellow-500' :
                  level.zone === 'orange' ? 'bg-orange-500' :
                  'bg-red-500'
                } ${isActive ? 'ring-2 ring-offset-2 ring-offset-gray-900 ' + zoneColors.ring : ''}`} />
                <div className="flex-1">
                  <span className="text-sm text-[#4A4A4A] font-medium">{level.label}</span>
                  <span className="text-xs text-gray-500 ml-2">{level.desc}</span>
                </div>
                {isActive && <span className="text-xs font-medium text-black bg-gray-700 px-2 py-1 rounded">Tu posición</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Penalties History */}
      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-black">Historial de Penalizaciones</h2>
        </div>

        {penalties.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No tienes penalizaciones. ¡Sigue así!</p>
        ) : (
          <div className="space-y-3">
            {penalties.map((penalty) => (
              <div key={penalty.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  penalty.status === 'ACTIVE' ? 'bg-red-500' :
                  penalty.status === 'EXPIRED' ? 'bg-gray-500' :
                  penalty.status === 'REVOKED' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-[#4A4A4A] uppercase">{penalty.type.replace(/_/g, ' ')}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      penalty.status === 'ACTIVE' ? 'bg-red-500/20 text-red-400' :
                      penalty.status === 'APPEALED' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-[#4A4A4A]'
                    }`}>
                      {penalty.status}
                    </span>
                    <span className="text-xs text-gray-500">+{penalty.points} pts</span>
                  </div>
                  <p className="text-sm text-[#4A4A4A]">{penalty.reason}</p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    <span>{new Date(penalty.createdAt).toLocaleDateString('es-ES')}</span>
                    {penalty.expiresAt && <span>Expira: {new Date(penalty.expiresAt).toLocaleDateString('es-ES')}</span>}
                  </div>
                </div>
                {penalty.status === 'ACTIVE' && !penalty.appealedAt && (
                  <button className="text-xs text-[#0066FF] hover:text-[#0052CC] px-3 py-1.5 border border-blue-500/30 rounded-lg">
                    Apelar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
        <h2 className="text-lg font-medium text-[#0066FF] mb-3">Consejos para mejorar tu puntuación</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-[#0066FF] mt-0.5">1.</span>
            <span>Responde a las incidencias en menos de 24 horas (tienes 48h de plazo).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0066FF] mt-0.5">2.</span>
            <span>Envía los productos dentro del plazo estimado. Si hay retrasos, comunícalo al cliente.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0066FF] mt-0.5">3.</span>
            <span>Ofrece soluciones proactivas: reembolsos parciales, reemplazos, o créditos de tienda.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0066FF] mt-0.5">4.</span>
            <span>Mantén una buena comunicación. Los clientes valoran la transparencia.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0066FF] mt-0.5">5.</span>
            <span>Los puntos de penalización expiran después de 90 días de buen comportamiento.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
