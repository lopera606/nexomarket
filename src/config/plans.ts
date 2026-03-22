export const PLANS = {
  FREE: {
    name: "Gratis",
    monthlyPrice: 0,
    commissionRate: 6,
    maxProducts: 50,
    features: ["analytics_basic", "support_community"],
  },
  PRO: {
    name: "Pro",
    monthlyPrice: 19.99,
    commissionRate: 4,
    maxProducts: -1,
    features: [
      "analytics_advanced",
      "badge_verified",
      "priority_search",
      "api_access",
      "support_email",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    monthlyPrice: 49.99,
    commissionRate: 3,
    maxProducts: -1,
    features: [
      "analytics_premium",
      "badge_verified",
      "priority_search_max",
      "api_access",
      "webhooks",
      "support_account_manager",
      "custom_reports",
    ],
  },
} as const;
