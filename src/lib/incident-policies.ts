/**
 * NexoMarket - Políticas de Incidencias y Penalizaciones
 *
 * Filosofía: Ser justo con los vendedores, dar oportunidades de mejora,
 * pero proteger a los compradores. Menos estricto que Amazon.
 *
 * Sistema de puntos de penalización:
 * - 0-10 puntos: Zona verde (sin consecuencias)
 * - 11-25 puntos: Zona amarilla (advertencias)
 * - 26-50 puntos: Zona naranja (restricciones)
 * - 51-75 puntos: Zona roja (suspensión temporal)
 * - 76+ puntos: Zona crítica (suspensión permanente)
 *
 * Los puntos expiran después de 90 días (rolling window).
 */

// ============================================================
// TIEMPOS LÍMITE DE RESPUESTA
// ============================================================

export const RESPONSE_DEADLINES = {
  /** Horas para primera respuesta del vendedor a una incidencia */
  FIRST_RESPONSE_HOURS: 48, // Amazon: 24h, nosotros: 48h

  /** Horas adicionales para cada respuesta posterior */
  FOLLOW_UP_RESPONSE_HOURS: 72,

  /** Horas antes de escalar automáticamente a admin */
  AUTO_ESCALATION_HOURS: 120, // 5 días

  /** Días máximos para resolver una incidencia antes de cierre automático */
  MAX_RESOLUTION_DAYS: 30,

  /** Horas para que el vendedor acepte un pedido */
  ORDER_ACCEPTANCE_HOURS: 48,

  /** Días máximos de retraso en envío antes de penalización */
  LATE_SHIPPING_GRACE_DAYS: 3,
} as const;

// ============================================================
// PUNTOS DE PENALIZACIÓN POR INFRACCIÓN
// ============================================================

export const PENALTY_POINTS = {
  /** No responder a incidencia en plazo (primera vez) */
  NO_RESPONSE_FIRST: 5,

  /** No responder a incidencia en plazo (reincidencia) */
  NO_RESPONSE_REPEAT: 10,

  /** No enviar producto en plazo estimado */
  LATE_SHIPPING: 5,

  /** No enviar producto y no comunicar motivo (>7 días) */
  NON_DELIVERY_NO_COMMUNICATION: 15,

  /** Producto dañado confirmado */
  DAMAGED_ITEM_CONFIRMED: 8,

  /** Producto incorrecto enviado */
  WRONG_ITEM_CONFIRMED: 10,

  /** Producto defectuoso confirmado */
  DEFECTIVE_ITEM_CONFIRMED: 8,

  /** Cancelar pedido sin motivo válido */
  UNJUSTIFIED_CANCELLATION: 10,

  /** Múltiples incidencias en periodo corto (>3 en 30 días) */
  HIGH_INCIDENT_RATE: 15,

  /** Valoración media inferior a 2.0 (rolling 90 días) */
  LOW_RATING: 10,

  /** No completar devolución/reembolso acordado */
  REFUND_NOT_COMPLETED: 12,
} as const;

// ============================================================
// UMBRALES DE PENALIZACIÓN (POR PUNTOS ACUMULADOS)
// ============================================================

export const PENALTY_THRESHOLDS = {
  /**
   * Zona verde: 0-10 puntos
   * Sin consecuencias, solo notificaciones informativas
   */
  WARNING_THRESHOLD: 11,

  /**
   * Zona amarilla: 11-25 puntos
   * Se emiten advertencias formales. El vendedor recibe email.
   * Se muestra un badge de "Bajo supervisión" en el panel del vendedor.
   */
  VISIBILITY_REDUCTION_THRESHOLD: 26,

  /**
   * Zona naranja: 26-50 puntos
   * - Reducción de visibilidad en búsquedas (productos aparecen más abajo)
   * - Aumento temporal de comisión (+2%)
   * - No puede crear cupones ni destacar productos
   * - Se muestra indicador visual al comprador
   */
  TEMPORARY_SUSPENSION_THRESHOLD: 51,

  /**
   * Zona roja: 51-75 puntos
   * - Suspensión temporal (7-30 días según severidad)
   * - Tienda no visible para compradores
   * - Se notifica a compradores con pedidos pendientes
   * - El vendedor puede apelar
   */
  PERMANENT_SUSPENSION_THRESHOLD: 76,

  /**
   * Zona crítica: 76+ puntos
   * - Suspensión permanente
   * - Revisión obligatoria por admin
   * - El vendedor puede apelar una vez
   */
} as const;

// ============================================================
// CONFIGURACIÓN DE PENALIZACIONES
// ============================================================

export const PENALTY_CONFIG = {
  /** Días para que expiren los puntos de penalización */
  POINTS_EXPIRY_DAYS: 90,

  /** Número mínimo de pedidos para evaluar métricas */
  MIN_ORDERS_FOR_EVALUATION: 5,

  /** Porcentaje máximo de aumento de comisión como penalización */
  MAX_COMMISSION_INCREASE_PERCENT: 3,

  /** Días mínimos de suspensión temporal */
  MIN_SUSPENSION_DAYS: 7,

  /** Días máximos de suspensión temporal */
  MAX_SUSPENSION_DAYS: 30,

  /** Número de apelaciones permitidas para suspensión permanente */
  MAX_APPEALS_PERMANENT: 1,

  /** Días para presentar apelación */
  APPEAL_WINDOW_DAYS: 15,

  /** Incidencias en N días para considerar "tasa alta" */
  HIGH_INCIDENT_COUNT: 3,
  HIGH_INCIDENT_WINDOW_DAYS: 30,

  /** Rating mínimo aceptable */
  MIN_ACCEPTABLE_RATING: 2.0,

  /** Tasa máxima aceptable de cancelaciones */
  MAX_CANCELLATION_RATE: 10, // 10%

  /** Tasa máxima aceptable de incidencias sobre pedidos */
  MAX_INCIDENT_RATE: 15, // 15%
} as const;

// ============================================================
// REGLAS DE ESCALACIÓN AUTOMÁTICA
// ============================================================

export const ESCALATION_RULES = {
  /**
   * Regla 1: Sin respuesta del vendedor
   * Si el vendedor no responde en FIRST_RESPONSE_HOURS,
   * se envía recordatorio. Si no responde en AUTO_ESCALATION_HOURS,
   * se escala automáticamente.
   */
  NO_RESPONSE: {
    reminderAfterHours: 36,    // Recordatorio amable a las 36h
    deadlineHours: 48,          // Marca como "sin respuesta" a las 48h
    escalationHours: 120,       // Escala a admin a los 5 días
    penaltyPoints: PENALTY_POINTS.NO_RESPONSE_FIRST,
  },

  /**
   * Regla 2: Producto no entregado
   * Si pasan 7 días después de la fecha estimada de entrega
   * sin tracking actualizado ni comunicación del vendedor.
   */
  NON_DELIVERY: {
    graceDaysAfterEstimate: 7,
    autoRefundDays: 15,         // Reembolso automático a los 15 días
    penaltyPoints: PENALTY_POINTS.NON_DELIVERY_NO_COMMUNICATION,
  },

  /**
   * Regla 3: Alta tasa de incidencias
   * Si la tienda acumula 3+ incidencias en 30 días,
   * se genera una penalización adicional.
   */
  HIGH_INCIDENT_RATE: {
    threshold: PENALTY_CONFIG.HIGH_INCIDENT_COUNT,
    windowDays: PENALTY_CONFIG.HIGH_INCIDENT_WINDOW_DAYS,
    penaltyPoints: PENALTY_POINTS.HIGH_INCIDENT_RATE,
  },
} as const;

// ============================================================
// TIPOS DE RESOLUCIÓN
// ============================================================

export const RESOLUTION_TYPES = {
  FULL_REFUND: 'full_refund',
  PARTIAL_REFUND: 'partial_refund',
  REPLACEMENT: 'replacement',
  STORE_CREDIT: 'store_credit',
  MUTUAL_AGREEMENT: 'mutual_agreement',
  NO_ACTION: 'no_action', // Incidencia infundada
  SELLER_WARNING: 'seller_warning',
} as const;

// ============================================================
// HEALTH SCORE: CÁLCULO DE PUNTUACIÓN DE TIENDA
// ============================================================

export const HEALTH_SCORE_WEIGHTS = {
  /** Peso de la tasa de respuesta en el score general */
  RESPONSE_RATE: 0.20,

  /** Peso del tiempo medio de respuesta */
  AVG_RESPONSE_TIME: 0.15,

  /** Peso de envíos a tiempo */
  ON_TIME_SHIPPING: 0.20,

  /** Peso de tasa de incidencias */
  INCIDENT_RATE: 0.15,

  /** Peso de tasa de resolución */
  RESOLUTION_RATE: 0.10,

  /** Peso de tasa de cancelación */
  CANCELLATION_RATE: 0.10,

  /** Peso de rating promedio */
  AVERAGE_RATING: 0.10,
} as const;

/**
 * Calcula el health score de una tienda (0-100)
 */
export function calculateHealthScore(metrics: {
  responseRate: number;          // 0-100
  avgResponseTimeHours: number;  // 0+
  onTimeShippingRate: number;    // 0-100
  incidentRate: number;          // 0-100
  resolutionRate: number;        // 0-100
  cancellationRate: number;      // 0-100
  avgRating: number;             // 0-5
}): number {
  const w = HEALTH_SCORE_WEIGHTS;

  // Response rate: 100% = perfecto
  const responseScore = metrics.responseRate;

  // Response time: <=4h = 100, >=48h = 0 (escala lineal)
  const responseTimeScore = Math.max(0, Math.min(100,
    100 - ((metrics.avgResponseTimeHours - 4) / 44) * 100
  ));

  // On-time shipping
  const shippingScore = metrics.onTimeShippingRate;

  // Incident rate: 0% = 100, >=15% = 0
  const incidentScore = Math.max(0, Math.min(100,
    100 - (metrics.incidentRate / 15) * 100
  ));

  // Resolution rate
  const resolutionScore = metrics.resolutionRate;

  // Cancellation rate: 0% = 100, >=10% = 0
  const cancellationScore = Math.max(0, Math.min(100,
    100 - (metrics.cancellationRate / 10) * 100
  ));

  // Rating: 5.0 = 100, 1.0 = 0
  const ratingScore = Math.max(0, ((metrics.avgRating - 1) / 4) * 100);

  const totalScore =
    responseScore * w.RESPONSE_RATE +
    responseTimeScore * w.AVG_RESPONSE_TIME +
    shippingScore * w.ON_TIME_SHIPPING +
    incidentScore * w.INCIDENT_RATE +
    resolutionScore * w.RESOLUTION_RATE +
    cancellationScore * w.CANCELLATION_RATE +
    ratingScore * w.AVERAGE_RATING;

  return Math.round(Math.max(0, Math.min(100, totalScore)));
}

/**
 * Determina el nivel de penalización según los puntos acumulados
 */
type PenaltyTypeString = 'WARNING' | 'VISIBILITY_REDUCTION' | 'COMMISSION_INCREASE' | 'FEATURE_RESTRICTION' | 'TEMPORARY_SUSPENSION' | 'PERMANENT_SUSPENSION';

export function getPenaltyLevel(totalPoints: number): {
  zone: 'green' | 'yellow' | 'orange' | 'red' | 'critical';
  label: string;
  labelEs: string;
  penaltyType: PenaltyTypeString | null;
} {

  if (totalPoints < PENALTY_THRESHOLDS.WARNING_THRESHOLD) {
    return { zone: 'green', label: 'Good Standing', labelEs: 'Buen estado', penaltyType: null };
  }
  if (totalPoints < PENALTY_THRESHOLDS.VISIBILITY_REDUCTION_THRESHOLD) {
    return { zone: 'yellow', label: 'Under Review', labelEs: 'En revisión', penaltyType: 'WARNING' };
  }
  if (totalPoints < PENALTY_THRESHOLDS.TEMPORARY_SUSPENSION_THRESHOLD) {
    return { zone: 'orange', label: 'Restricted', labelEs: 'Restringida', penaltyType: 'VISIBILITY_REDUCTION' };
  }
  if (totalPoints < PENALTY_THRESHOLDS.PERMANENT_SUSPENSION_THRESHOLD) {
    return { zone: 'red', label: 'Suspended', labelEs: 'Suspendida', penaltyType: 'TEMPORARY_SUSPENSION' };
  }
  return { zone: 'critical', label: 'Permanently Suspended', labelEs: 'Suspendida permanentemente', penaltyType: 'PERMANENT_SUSPENSION' };
}

/**
 * Genera el número de incidencia único
 */
export function generateIncidentNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INC-${year}${month}-${random}`;
}

/**
 * Calcula la fecha límite de respuesta del vendedor
 */
export function calculateResponseDeadline(createdAt: Date = new Date()): Date {
  const deadline = new Date(createdAt);
  deadline.setHours(deadline.getHours() + RESPONSE_DEADLINES.FIRST_RESPONSE_HOURS);
  return deadline;
}

/**
 * Determina la prioridad automática según el tipo de incidencia
 */
export function getAutoPriority(type: string, orderAmount?: number): string {
  // Pedidos de alto valor (>200€) suben la prioridad
  const isHighValue = orderAmount && orderAmount > 200;

  switch (type) {
    case 'NON_DELIVERY':
      return isHighValue ? 'URGENT' : 'HIGH';
    case 'DAMAGED_ITEM':
    case 'WRONG_ITEM':
      return isHighValue ? 'HIGH' : 'MEDIUM';
    case 'DEFECTIVE_ITEM':
      return 'MEDIUM';
    case 'LATE_DELIVERY':
      return 'LOW';
    case 'REFUND_REQUEST':
      return isHighValue ? 'HIGH' : 'MEDIUM';
    case 'SELLER_NO_RESPONSE':
      return 'HIGH';
    default:
      return 'MEDIUM';
  }
}
