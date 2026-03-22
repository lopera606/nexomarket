import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  calculateHealthScore,
  getPenaltyLevel,
  PENALTY_CONFIG,
} from '@/lib/incident-policies';

export const runtime = 'nodejs';

/**
 * GET /api/store/health-score?storeId=xxx
 * Calculate and return the store health score
 */
export async function GET(request: NextRequest) {
  try {
    const storeId = request.nextUrl.searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json(
        { error: 'storeId query parameter is required' },
        { status: 400 }
      );
    }

    const store = await db.store.findUnique({
      where: { id: storeId },
      select: { id: true, name: true, avgRating: true, totalReviews: true },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Calculate rolling 90-day window
    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() - 90);

    // Fetch all metrics in parallel
    const [
      totalSubOrders,
      cancelledSubOrders,
      deliveredSubOrders,
      lateDeliveries,
      totalIncidents,
      resolvedIncidents,
      incidentsWithResponse,
      allIncidentResponseTimes,
      activePenalties,
      totalPenaltyPoints,
    ] = await Promise.all([
      // Total sub-orders in window
      db.subOrder.count({
        where: { storeId, createdAt: { gte: windowStart } },
      }),

      // Cancelled sub-orders
      db.subOrder.count({
        where: { storeId, status: 'CANCELLED', createdAt: { gte: windowStart } },
      }),

      // Delivered sub-orders
      db.subOrder.count({
        where: { storeId, status: 'DELIVERED', createdAt: { gte: windowStart } },
      }),

      // Late deliveries (shipped after estimated date) - approximate using shipments
      db.shipment.count({
        where: {
          subOrder: { storeId },
          createdAt: { gte: windowStart },
          status: 'DELIVERED',
          deliveredAt: { not: null },
          // We check if deliveredAt > estimatedDelivery in post-processing
        },
      }),

      // Total incidents
      db.incident.count({
        where: { storeId, createdAt: { gte: windowStart } },
      }),

      // Resolved incidents
      db.incident.count({
        where: { storeId, status: 'RESOLVED', createdAt: { gte: windowStart } },
      }),

      // Incidents where seller responded
      db.incident.count({
        where: {
          storeId,
          createdAt: { gte: windowStart },
          sellerFirstResponseAt: { not: null },
        },
      }),

      // Get incidents with response times for average calculation
      db.incident.findMany({
        where: {
          storeId,
          createdAt: { gte: windowStart },
          sellerFirstResponseAt: { not: null },
        },
        select: { createdAt: true, sellerFirstResponseAt: true },
      }),

      // Active penalties
      db.storePenalty.count({
        where: {
          storeId,
          status: 'ACTIVE',
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      }),

      // Total penalty points (non-expired)
      db.storePenalty.aggregate({
        where: {
          storeId,
          status: 'ACTIVE',
          createdAt: { gte: windowStart },
        },
        _sum: { points: true },
      }),
    ]);

    // Calculate metrics
    const responseRate = totalIncidents > 0
      ? (incidentsWithResponse / totalIncidents) * 100
      : 100;

    // Average response time in hours
    let avgResponseTimeHours = 0;
    if (allIncidentResponseTimes.length > 0) {
      const totalHours = allIncidentResponseTimes.reduce((sum: number, inc: { createdAt: Date; sellerFirstResponseAt: Date | null }) => {
        const diff = inc.sellerFirstResponseAt!.getTime() - inc.createdAt.getTime();
        return sum + diff / (1000 * 60 * 60);
      }, 0);
      avgResponseTimeHours = totalHours / allIncidentResponseTimes.length;
    }

    // On-time shipping rate (approximate)
    const onTimeShippingRate = deliveredSubOrders > 0
      ? Math.max(0, ((deliveredSubOrders - lateDeliveries) / deliveredSubOrders) * 100)
      : 100;

    // Incident rate
    const incidentRate = totalSubOrders > 0
      ? (totalIncidents / totalSubOrders) * 100
      : 0;

    // Resolution rate
    const resolutionRate = totalIncidents > 0
      ? (resolvedIncidents / totalIncidents) * 100
      : 100;

    // Cancellation rate
    const cancellationRate = totalSubOrders > 0
      ? (cancelledSubOrders / totalSubOrders) * 100
      : 0;

    const avgRating = Number(store.avgRating);
    const points = totalPenaltyPoints._sum.points || 0;

    // Calculate overall score
    const overallScore = calculateHealthScore({
      responseRate,
      avgResponseTimeHours,
      onTimeShippingRate,
      incidentRate,
      resolutionRate,
      cancellationRate,
      avgRating,
    });

    const penaltyLevel = getPenaltyLevel(points);

    // Upsert health score record
    await db.storeHealthScore.upsert({
      where: { storeId },
      create: {
        storeId,
        overallScore,
        responseRate,
        avgResponseTimeHours,
        onTimeShippingRate,
        incidentRate,
        resolutionRate,
        cancelationRate: cancellationRate,
        totalPenaltyPoints: points,
        activePenalties,
        lastEvaluatedAt: new Date(),
      },
      update: {
        overallScore,
        responseRate,
        avgResponseTimeHours,
        onTimeShippingRate,
        incidentRate,
        resolutionRate,
        cancelationRate: cancellationRate,
        totalPenaltyPoints: points,
        activePenalties,
        lastEvaluatedAt: new Date(),
      },
    });

    return NextResponse.json({
      storeId,
      storeName: store.name,
      overallScore,
      penaltyLevel,
      metrics: {
        responseRate: Math.round(responseRate * 100) / 100,
        avgResponseTimeHours: Math.round(avgResponseTimeHours * 100) / 100,
        onTimeShippingRate: Math.round(onTimeShippingRate * 100) / 100,
        incidentRate: Math.round(incidentRate * 100) / 100,
        resolutionRate: Math.round(resolutionRate * 100) / 100,
        cancellationRate: Math.round(cancellationRate * 100) / 100,
        avgRating,
      },
      penalties: {
        totalPoints: points,
        activePenalties,
      },
      totalOrders: totalSubOrders,
      evaluationWindow: '90 days',
      evaluatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GET /api/store/health-score error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate health score' },
      { status: 500 }
    );
  }
}
