// Type augmentations handled via `any` casts in auth.ts to avoid
// NextAuth v5 module resolution issues during build.

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  country?: string;
  inStock?: boolean;
  sellerId?: string;
  rating?: number;
  verified?: boolean;
}

export interface ShippingOption {
  id: string;
  carrier: string;
  service: string;
  estimatedDays: number;
  cost: number;
  currency: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  sellerId: string;
}

export interface CheckoutData {
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string;
  paymentMethod: string;
}

export interface SellerMetrics {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  avgRating: number;
  reviewCount: number;
  cancelledOrders: number;
  returnRate: number;
}

export interface AnalyticsData {
  date: string;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
}
