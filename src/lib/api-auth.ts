import { NextRequest, NextResponse } from "next/server";
import { db } from "./db";
import { PLANS } from "@/config/plans";

interface AuthenticatedRequest {
  storeId: string;
  userId: string;
  storeName: string;
  planTier: string;
}

/**
 * Authenticates API key from Bearer token in Authorization header.
 * Validates that store is ACTIVE and has API access enabled in their plan.
 * Returns 401 if invalid/missing key, 403 if plan doesn't allow API access.
 */
export async function authenticateApiKey(
  request: NextRequest
): Promise<{
  authenticated: boolean;
  data?: AuthenticatedRequest;
  response?: NextResponse;
}> {
  try {
    // Extract the Authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            success: false,
            error: "Missing or invalid Authorization header. Use: Authorization: Bearer <api_key>",
          },
          { status: 401 }
        ),
      };
    }

    const apiKey = authHeader.substring(7); // Remove "Bearer "

    if (!apiKey || apiKey.trim() === "") {
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            success: false,
            error: "API key cannot be empty",
          },
          { status: 401 }
        ),
      };
    }

    // Find the store by API key
    // Note: Assuming the api_key is stored in Store model as "apiKey" field
    // This requires adding apiKey field to Store schema
    const store = await (db.store as any).findUnique({
      where: { apiKey },
      include: {
        owner: true,
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!store) {
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            success: false,
            error: "Invalid API key",
          },
          { status: 401 }
        ),
      };
    }

    // Verify store is ACTIVE
    if (store.status !== "ACTIVE") {
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            success: false,
            error: `Store is not active. Current status: ${store.status}`,
          },
          { status: 403 }
        ),
      };
    }

    // Check if plan allows API access
    const planConfig = PLANS[store.planTier as keyof typeof PLANS];

    if (!planConfig || !(planConfig.features as readonly string[]).includes("api_access")) {
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            success: false,
            error: `API access is not available in the ${store.planTier} plan. Upgrade to PRO or ENTERPRISE to use the API.`,
          },
          { status: 403 }
        ),
      };
    }

    return {
      authenticated: true,
      data: {
        storeId: store.id,
        userId: store.ownerId,
        storeName: store.name,
        planTier: store.planTier,
      },
    };
  } catch (error) {
    console.error("API authentication error:", error);
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Internal server error during authentication",
        },
        { status: 500 }
      ),
    };
  }
}

/**
 * Helper to create standardized JSON response for API routes
 */
export function apiResponse(
  success: boolean,
  data?: unknown,
  error?: string,
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
) {
  const response: Record<string, unknown> = { success };

  if (data !== undefined) {
    response.data = data;
  }

  if (error) {
    response.error = error;
  }

  if (pagination) {
    response.pagination = pagination;
  }

  return response;
}
