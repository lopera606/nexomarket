import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const store = await db.store.findUnique({
      where: { ownerId: session.user.id },
      select: { id: true, avgRating: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 });
    }

    // Fetch health score if exists
    const healthScore = await db.storeHealthScore.findUnique({
      where: { storeId: store.id },
    });

    // Fetch penalties
    const penalties = await db.storePenalty.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const activePenalties = penalties.filter(p => p.status === "ACTIVE");
    const totalPoints = activePenalties.reduce((sum, p) => sum + p.points, 0);

    // Compute total orders in last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const totalOrders = await db.subOrder.count({
      where: {
        storeId: store.id,
        createdAt: { gte: ninetyDaysAgo },
      },
    });

    // Compute cancellation rate
    const cancelledOrders = await db.subOrder.count({
      where: {
        storeId: store.id,
        createdAt: { gte: ninetyDaysAgo },
        status: "CANCELLED",
      },
    });

    const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

    // Determine penalty zone
    let zone = "green";
    let labelEs = "Buen estado";
    if (totalPoints > 75) { zone = "critical"; labelEs = "Suspensión permanente"; }
    else if (totalPoints > 50) { zone = "red"; labelEs = "Suspensión temporal"; }
    else if (totalPoints > 25) { zone = "orange"; labelEs = "Reducción de visibilidad"; }
    else if (totalPoints > 10) { zone = "yellow"; labelEs = "Advertencias"; }

    const overallScore = Math.max(0, 100 - totalPoints);

    const data = {
      overallScore: healthScore ? healthScore.overallScore : overallScore,
      penaltyLevel: { zone, labelEs },
      metrics: {
        responseRate: healthScore ? Number(healthScore.responseRate) : 100,
        avgResponseTimeHours: healthScore ? Number(healthScore.avgResponseTimeHours) : 0,
        onTimeShippingRate: healthScore ? Number(healthScore.onTimeShippingRate) : 100,
        incidentRate: healthScore ? Number(healthScore.incidentRate) : 0,
        resolutionRate: healthScore ? Number(healthScore.resolutionRate) : 100,
        cancellationRate: healthScore ? Number(healthScore.cancelationRate) : Number(cancellationRate.toFixed(1)),
        avgRating: Number(store.avgRating),
      },
      penalties: {
        totalPoints,
        activePenalties: activePenalties.length,
      },
      totalOrders,
      penaltyHistory: penalties.map(p => ({
        id: p.id,
        type: p.type,
        status: p.status,
        reason: p.reason,
        points: p.points,
        createdAt: p.createdAt.toISOString(),
        expiresAt: p.expiresAt?.toISOString() || null,
        appealedAt: p.appealedAt?.toISOString() || null,
      })),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/vendedor/salud error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
