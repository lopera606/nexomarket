import { handlers } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const { GET: originalGET, POST: originalPOST } = handlers;

export const GET = originalGET;

export async function POST(request: NextRequest, context: any) {
  // Rate limit: 20 requests per 5 min per IP
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { success } = rateLimit(`auth:${ip}`, 20, 5 * 60 * 1000);
  if (!success) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes de autenticación. Intenta de nuevo en unos minutos." },
      { status: 429 }
    );
  }

  return originalPOST(request, context);
}
