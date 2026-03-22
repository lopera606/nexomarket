# NexoMarket Seller API Documentation

## Overview

The NexoMarket Seller API enables sellers to programmatically manage their store, products, orders, and shipping operations. This REST API provides full control over your store's operations without using the dashboard.

### Base URL
```
https://api.nexomarket.com/api/v1
```

### Authentication
All requests require an API key passed in the `Authorization` header:
```
Authorization: Bearer <api_key>
```

### Requirements
- **Plan**: Pro or Enterprise plan required to access the API
- **Rate Limits**:
  - Pro Plan: 100 requests per minute
  - Enterprise Plan: 500 requests per minute

### Response Format
All API responses follow a standard JSON format:
```json
{
  "success": true,
  "data": {},
  "error": null,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Response Fields**:
- `success` (boolean): Indicates if the request was successful
- `data` (any): The response payload (null if error)
- `error` (string): Error message (null if successful)
- `pagination` (object): Included for list endpoints only

---

## Authentication

### Getting Your API Key

1. Log in to your NexoMarket Seller Dashboard
2. Navigate to **Settings** > **API & Integrations**
3. Click **Generate API Key**
4. Copy your API key and store it securely
5. Use the key in the `Authorization` header for all API requests

**Important**: Keep your API key secret. Treat it like a password. If compromised, regenerate it immediately.

### Authentication Header Format
```
Authorization: Bearer sk_live_abc123xyz789...
```

### Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "data": null,
  "error": "Invalid or missing API key",
  "pagination": null
}
```

**403 Forbidden**
```json
{
  "success": false,
  "data": null,
  "error": "Your plan does not include API access. Upgrade to Pro or Enterprise.",
  "pagination": null
}
```

---

## Endpoints

### Products

#### List Products
```
GET /products
```

**Description**: Retrieve a paginated list of your products with optional filtering and search.

**Required Plan**: Pro, Enterprise

**Headers**:
```
Authorization: Bearer <api_key>
Content-Type: application/json
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page, max 100 (default: 20) |
| status | string | No | Filter by status: `active`, `draft`, `archived` |
| category | string | No | Filter by category ID |
| search | string | No | Search by product name or SKU |
| sortBy | string | No | Sort field: `name`, `price`, `createdAt` (default: `createdAt`) |
| sortOrder | string | No | `asc` or `desc` (default: `desc`) |

**Response Example**:
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_abc123",
      "name": "Wireless Noise-Cancelling Headphones",
      "description": "Premium over-ear headphones with active noise cancellation",
      "sku": "WNC-HDN-001",
      "status": "active",
      "basePrice": 199.99,
      "compareAtPrice": 299.99,
      "cost": 80.00,
      "categoryId": "cat_electronics_001",
      "categoryName": "Electronics",
      "attributes": {
        "color": "Black",
        "material": "Aluminum",
        "warranty": "2 years"
      },
      "variants": [
        {
          "id": "var_001",
          "name": "Black - 32GB",
          "sku": "WNC-HDN-001-BLK-32GB",
          "price": 199.99,
          "stock": 45,
          "attributes": {
            "color": "Black",
            "storage": "32GB"
          }
        }
      ],
      "totalStock": 45,
      "rating": 4.7,
      "reviewCount": 234,
      "images": [
        {
          "id": "img_001",
          "url": "https://cdn.nexomarket.com/products/prod_abc123/img_001.jpg",
          "altText": "Front view of headphones",
          "isPrimary": true
        }
      ],
      "createdAt": "2025-06-15T10:30:00Z",
      "updatedAt": "2026-03-14T14:22:15Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

**Error Codes**: 400, 401, 403

---

#### Create Product
```
POST /products
```

**Description**: Create a new product with variants and attributes.

**Required Plan**: Pro, Enterprise

**Headers**:
```
Authorization: Bearer <api_key>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Premium Wireless Headphones",
  "description": "High-quality wireless headphones with 30-hour battery life and active noise cancellation",
  "basePrice": 149.99,
  "compareAtPrice": 249.99,
  "cost": 60.00,
  "categoryId": "cat_electronics_001",
  "sku": "PWH-001",
  "weight": 0.3,
  "weightUnit": "kg",
  "attributes": {
    "color": "Black",
    "material": "Aluminum and Leather",
    "warranty": "1 year"
  },
  "variants": [
    {
      "name": "Black - Standard",
      "sku": "PWH-001-BLK-STD",
      "price": 149.99,
      "compareAtPrice": 249.99,
      "cost": 60.00,
      "stock": 50,
      "attributes": {
        "color": "Black",
        "variant": "Standard"
      }
    },
    {
      "name": "Silver - Premium",
      "sku": "PWH-001-SLV-PRE",
      "price": 199.99,
      "compareAtPrice": 299.99,
      "cost": 85.00,
      "stock": 30,
      "attributes": {
        "color": "Silver",
        "variant": "Premium"
      }
    }
  ]
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "prod_xyz789",
    "name": "Premium Wireless Headphones",
    "description": "High-quality wireless headphones with 30-hour battery life and active noise cancellation",
    "sku": "PWH-001",
    "basePrice": 149.99,
    "compareAtPrice": 249.99,
    "cost": 60.00,
    "status": "draft",
    "categoryId": "cat_electronics_001",
    "createdAt": "2026-03-14T14:30:00Z",
    "updatedAt": "2026-03-14T14:30:00Z"
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 400, 401, 403, 409, 422

---

#### Get Single Product
```
GET /products/:id
```

**Description**: Retrieve detailed information for a specific product.

**Required Plan**: Pro, Enterprise

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Product ID |

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "prod_abc123",
    "name": "Wireless Noise-Cancelling Headphones",
    "description": "Premium over-ear headphones with active noise cancellation",
    "sku": "WNC-HDN-001",
    "status": "active",
    "basePrice": 199.99,
    "compareAtPrice": 299.99,
    "cost": 80.00,
    "categoryId": "cat_electronics_001",
    "weight": 0.25,
    "weightUnit": "kg",
    "attributes": {
      "color": "Black",
      "material": "Aluminum",
      "warranty": "2 years"
    },
    "variants": [
      {
        "id": "var_001",
        "name": "Black - 32GB",
        "sku": "WNC-HDN-001-BLK-32GB",
        "price": 199.99,
        "compareAtPrice": 299.99,
        "cost": 80.00,
        "stock": 45,
        "attributes": {
          "color": "Black",
          "storage": "32GB"
        }
      }
    ],
    "images": [
      {
        "id": "img_001",
        "url": "https://cdn.nexomarket.com/products/prod_abc123/img_001.jpg",
        "altText": "Front view of headphones",
        "isPrimary": true
      },
      {
        "id": "img_002",
        "url": "https://cdn.nexomarket.com/products/prod_abc123/img_002.jpg",
        "altText": "Side view",
        "isPrimary": false
      }
    ],
    "createdAt": "2025-06-15T10:30:00Z",
    "updatedAt": "2026-03-14T14:22:15Z"
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 401, 403, 404

---

#### Update Product
```
PUT /products/:id
```

**Description**: Update a product (supports partial updates). Only provided fields will be updated.

**Required Plan**: Pro, Enterprise

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Product ID |

**Request Body** (all fields optional):
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "basePrice": 179.99,
  "compareAtPrice": 279.99,
  "cost": 70.00,
  "status": "active",
  "weight": 0.25,
  "attributes": {
    "color": "Black",
    "material": "Premium Aluminum"
  }
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "prod_abc123",
    "name": "Updated Product Name",
    "description": "Updated description",
    "basePrice": 179.99,
    "compareAtPrice": 279.99,
    "cost": 70.00,
    "status": "active",
    "updatedAt": "2026-03-14T15:45:30Z"
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 400, 401, 403, 404, 422

---

#### Delete Product
```
DELETE /products/:id
```

**Description**: Soft delete a product. The product will be archived and hidden from customer view but retained for records.

**Required Plan**: Pro, Enterprise

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Product ID |

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "prod_abc123",
    "status": "archived"
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 401, 403, 404

---

### Product Images

#### List Product Images
```
GET /products/:id/images
```

**Description**: Get all images for a specific product.

**Required Plan**: Pro, Enterprise

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Product ID |

**Response Example**:
```json
{
  "success": true,
  "data": [
    {
      "id": "img_001",
      "url": "https://cdn.nexomarket.com/products/prod_abc123/img_001.jpg",
      "altText": "Front view of headphones",
      "isPrimary": true,
      "variantId": null,
      "width": 800,
      "height": 800,
      "size": 245000,
      "createdAt": "2025-06-15T10:35:00Z"
    },
    {
      "id": "img_002",
      "url": "https://cdn.nexomarket.com/products/prod_abc123/img_002.jpg",
      "altText": "Side view",
      "isPrimary": false,
      "variantId": "var_001",
      "width": 800,
      "height": 800,
      "size": 267000,
      "createdAt": "2025-06-15T10:36:00Z"
    }
  ],
  "error": null,
  "pagination": null
}
```

**Error Codes**: 401, 403, 404

---

#### Upload Product Image
```
POST /products/:id/images
```

**Description**: Upload a new image for a product. Images must be in base64 format. Maximum file size: 10MB.

**Required Plan**: Pro, Enterprise

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Product ID |

**Request Body**:
```json
{
  "data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "altText": "Product front view",
  "isPrimary": false,
  "variantId": "var_001"
}
```

**Field Descriptions**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| data | string | Yes | Base64-encoded image data (JPEG, PNG, WebP) |
| altText | string | Yes | Alt text for accessibility |
| isPrimary | boolean | No | Set as primary product image (default: false) |
| variantId | string | No | Associate image with specific variant |

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "img_new_123",
    "url": "https://cdn.nexomarket.com/products/prod_abc123/img_new_123.jpg",
    "altText": "Product front view",
    "isPrimary": false,
    "variantId": "var_001",
    "width": 800,
    "height": 800,
    "size": 245000,
    "createdAt": "2026-03-14T16:00:00Z"
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 400, 401, 403, 404, 422

---

#### Delete Product Image
```
DELETE /products/:id/images
```

**Description**: Delete a specific image from a product.

**Required Plan**: Pro, Enterprise

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Product ID |

**Request Body**:
```json
{
  "imageId": "img_001"
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "img_001",
    "deleted": true
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 401, 403, 404

---

### Orders

#### List Orders
```
GET /orders
```

**Description**: Retrieve a paginated list of sub-orders (individual items purchased by customers) with optional filtering.

**Required Plan**: Pro, Enterprise

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page, max 100 (default: 20) |
| status | string | No | Filter by status: `pending`, `accepted`, `shipped`, `delivered`, `cancelled` |
| dateFrom | string | No | ISO 8601 date (e.g., `2026-01-01T00:00:00Z`) |
| dateTo | string | No | ISO 8601 date |
| search | string | No | Search by order ID or customer name |
| sortBy | string | No | Sort field: `createdAt`, `updatedAt`, `totalAmount` (default: `createdAt`) |

**Response Example**:
```json
{
  "success": true,
  "data": [
    {
      "id": "sub_order_abc123",
      "parentOrderId": "order_xyz789",
      "status": "pending",
      "sellerId": "seller_001",
      "customerName": "John Smith",
      "customerEmail": "john@example.com",
      "items": [
        {
          "id": "line_001",
          "productId": "prod_abc123",
          "productName": "Wireless Noise-Cancelling Headphones",
          "sku": "WNC-HDN-001-BLK-32GB",
          "variantId": "var_001",
          "quantity": 1,
          "unitPrice": 199.99,
          "lineTotal": 199.99,
          "status": "pending"
        }
      ],
      "subtotal": 199.99,
      "taxAmount": 16.00,
      "shippingCost": 10.00,
      "totalAmount": 225.99,
      "shippingAddress": {
        "name": "John Smith",
        "phone": "+1234567890",
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "US"
      },
      "billingAddress": {
        "name": "John Smith",
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "US"
      },
      "notes": "Please leave at door",
      "createdAt": "2026-03-14T08:30:00Z",
      "updatedAt": "2026-03-14T08:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 456,
    "totalPages": 23
  }
}
```

**Error Codes**: 400, 401, 403

---

#### Get Order Detail
```
GET /orders/:id
```

**Description**: Get detailed information about a specific order including items, customer info, and shipping status.

**Required Plan**: Pro, Enterprise

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Sub-order ID |

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "sub_order_abc123",
    "parentOrderId": "order_xyz789",
    "status": "accepted",
    "sellerId": "seller_001",
    "customerName": "Jane Doe",
    "customerEmail": "jane@example.com",
    "customerPhone": "+1987654321",
    "items": [
      {
        "id": "line_001",
        "productId": "prod_abc123",
        "productName": "Wireless Noise-Cancelling Headphones",
        "sku": "WNC-HDN-001-BLK-32GB",
        "variantId": "var_001",
        "quantity": 2,
        "unitPrice": 199.99,
        "lineTotal": 399.98,
        "status": "accepted"
      },
      {
        "id": "line_002",
        "productId": "prod_def456",
        "productName": "Phone Case - Premium Leather",
        "sku": "PC-LEATHER-BLK",
        "variantId": "var_002",
        "quantity": 1,
        "unitPrice": 29.99,
        "lineTotal": 29.99,
        "status": "accepted"
      }
    ],
    "subtotal": 429.97,
    "discountAmount": 0,
    "taxAmount": 34.40,
    "shippingCost": 15.00,
    "totalAmount": 479.37,
    "shippingAddress": {
      "name": "Jane Doe",
      "phone": "+1987654321",
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90001",
      "country": "US"
    },
    "billingAddress": {
      "name": "Jane Doe",
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90001",
      "country": "US"
    },
    "shipping": {
      "status": "pending",
      "trackingNumber": null,
      "carrier": null,
      "serviceLevel": null,
      "estimatedDelivery": null
    },
    "notes": "Gift wrap if possible",
    "createdAt": "2026-03-13T15:45:00Z",
    "updatedAt": "2026-03-14T09:20:00Z"
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 401, 403, 404

---

#### Accept Order
```
POST /orders/:id/accept
```

**Description**: Accept a pending order and move it to the next stage. Only pending orders can be accepted.

**Required Plan**: Pro, Enterprise

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Sub-order ID |

**Request Body** (optional):
```json
{
  "notes": "Order accepted and will be processed within 24 hours"
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "sub_order_abc123",
    "status": "accepted",
    "updatedAt": "2026-03-14T10:15:00Z"
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 400, 401, 403, 404, 409

---

#### Ship Order
```
POST /orders/:id/ship
```

**Description**: Mark an order as shipped and provide tracking information.

**Required Plan**: Pro, Enterprise

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Sub-order ID |

**Request Body**:
```json
{
  "trackingNumber": "1Z999AA10123456784",
  "carrier": "UPS",
  "serviceLevel": "Ground",
  "estimatedDeliveryDate": "2026-03-20"
}
```

**Field Descriptions**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| trackingNumber | string | Yes | Tracking number from carrier |
| carrier | string | Yes | Carrier name (UPS, FedEx, DHL, USPS, etc.) |
| serviceLevel | string | Yes | Service level (Ground, Express, Overnight, etc.) |
| estimatedDeliveryDate | string | No | Estimated delivery date (YYYY-MM-DD) |

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "sub_order_abc123",
    "status": "shipped",
    "shipping": {
      "trackingNumber": "1Z999AA10123456784",
      "carrier": "UPS",
      "serviceLevel": "Ground",
      "estimatedDelivery": "2026-03-20"
    },
    "updatedAt": "2026-03-14T14:30:00Z"
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 400, 401, 403, 404, 409

---

### Shipping

#### Get Shipping Rates
```
POST /shipping/rates
```

**Description**: Get available shipping rates for a shipment based on origin and destination addresses and parcel details.

**Required Plan**: Pro, Enterprise

**Request Body**:
```json
{
  "addressFrom": {
    "name": "Your Store",
    "street": "789 Commerce St",
    "city": "Chicago",
    "state": "IL",
    "postalCode": "60601",
    "country": "US",
    "phone": "+1234567890"
  },
  "addressTo": {
    "name": "John Smith",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US",
    "phone": "+1987654321"
  },
  "parcels": [
    {
      "length": 30,
      "width": 20,
      "height": 10,
      "lengthUnit": "cm",
      "weight": 0.5,
      "weightUnit": "kg"
    }
  ]
}
```

**Response Example**:
```json
{
  "success": true,
  "data": [
    {
      "id": "rate_001",
      "carrier": "UPS",
      "serviceLevel": "Ground",
      "cost": 15.99,
      "currency": "USD",
      "estimatedDays": 5,
      "estimatedDeliveryDate": "2026-03-20"
    },
    {
      "id": "rate_002",
      "carrier": "UPS",
      "serviceLevel": "Express",
      "cost": 24.99,
      "currency": "USD",
      "estimatedDays": 2,
      "estimatedDeliveryDate": "2026-03-17"
    },
    {
      "id": "rate_003",
      "carrier": "FedEx",
      "serviceLevel": "Ground",
      "cost": 14.50,
      "currency": "USD",
      "estimatedDays": 6,
      "estimatedDeliveryDate": "2026-03-21"
    }
  ],
  "error": null,
  "pagination": null
}
```

**Error Codes**: 400, 401, 403, 422

---

#### Generate Shipping Label
```
POST /shipping/labels
```

**Description**: Generate a shipping label for a sub-order using a selected rate.

**Required Plan**: Pro, Enterprise

**Request Body**:
```json
{
  "subOrderId": "sub_order_abc123",
  "rateId": "rate_001",
  "addressFrom": {
    "name": "Your Store",
    "street": "789 Commerce St",
    "city": "Chicago",
    "state": "IL",
    "postalCode": "60601",
    "country": "US",
    "phone": "+1234567890"
  },
  "addressTo": {
    "name": "John Smith",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US",
    "phone": "+1987654321"
  },
  "parcels": [
    {
      "length": 30,
      "width": 20,
      "height": 10,
      "lengthUnit": "cm",
      "weight": 0.5,
      "weightUnit": "kg"
    }
  ]
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "label_xyz789",
    "subOrderId": "sub_order_abc123",
    "trackingNumber": "1Z999AA10123456784",
    "carrier": "UPS",
    "serviceLevel": "Ground",
    "labelUrl": "https://cdn.nexomarket.com/labels/label_xyz789.pdf",
    "labelFormat": "PDF",
    "estimatedDeliveryDate": "2026-03-20",
    "cost": 15.99,
    "createdAt": "2026-03-14T15:00:00Z"
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 400, 401, 403, 404, 422

---

### Store

#### Get Store Profile
```
GET /store/profile
```

**Description**: Retrieve your store's profile information and settings.

**Required Plan**: Pro, Enterprise

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "store_abc123",
    "name": "TechGear Pro",
    "description": "Premium electronics and accessories for tech enthusiasts",
    "email": "support@techgearpro.com",
    "phone": "+1-800-TECH-001",
    "website": "https://techgearpro.com",
    "logo": "https://cdn.nexomarket.com/stores/store_abc123/logo.png",
    "banner": "https://cdn.nexomarket.com/stores/store_abc123/banner.jpg",
    "address": {
      "street": "789 Commerce St",
      "city": "Chicago",
      "state": "IL",
      "postalCode": "60601",
      "country": "US"
    },
    "businessLicense": "IL-12345678",
    "taxId": "12-3456789",
    "plan": "Enterprise",
    "totalProducts": 156,
    "totalOrders": 2341,
    "rating": 4.8,
    "reviewCount": 892,
    "joinedAt": "2024-01-15T00:00:00Z",
    "verified": true,
    "verifiedAt": "2024-02-20T00:00:00Z"
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 401, 403

---

#### Update Store Profile
```
PUT /store/profile
```

**Description**: Update your store's profile information (partial update).

**Required Plan**: Pro, Enterprise

**Request Body** (all fields optional):
```json
{
  "name": "TechGear Pro - Updated",
  "description": "Premium electronics and accessories",
  "email": "newemail@techgearpro.com",
  "phone": "+1-800-TECH-002",
  "website": "https://www.techgearpro.com",
  "address": {
    "street": "123 Tech Boulevard",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94105",
    "country": "US"
  }
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "store_abc123",
    "name": "TechGear Pro - Updated",
    "email": "newemail@techgearpro.com",
    "updatedAt": "2026-03-14T16:00:00Z"
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 400, 401, 403, 422

---

#### Get Store Statistics
```
GET /store/stats
```

**Description**: Retrieve key performance metrics and statistics for your store.

**Required Plan**: Pro, Enterprise

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| period | string | No | `day`, `week`, `month`, `quarter`, `year` (default: `month`) |
| dateFrom | string | No | ISO 8601 date |
| dateTo | string | No | ISO 8601 date |

**Response Example**:
```json
{
  "success": true,
  "data": {
    "period": "month",
    "dateFrom": "2026-02-14",
    "dateTo": "2026-03-14",
    "orders": {
      "total": 234,
      "completed": 198,
      "pending": 28,
      "cancelled": 8
    },
    "revenue": {
      "totalSales": 45678.50,
      "totalRefunds": 1234.00,
      "netRevenue": 44444.50,
      "avgOrderValue": 195.15
    },
    "products": {
      "totalProducts": 156,
      "activeProducts": 145,
      "draftProducts": 8,
      "archivedProducts": 3
    },
    "traffic": {
      "totalVisits": 12450,
      "uniqueVisitors": 8234,
      "conversionRate": 2.8,
      "avgSessionDuration": 185
    },
    "ratings": {
      "avgRating": 4.8,
      "totalReviews": 234,
      "5Star": 180,
      "4Star": 45,
      "3Star": 8,
      "2Star": 1,
      "1Star": 0
    },
    "topProducts": [
      {
        "productId": "prod_abc123",
        "name": "Wireless Noise-Cancelling Headphones",
        "unitsSold": 42,
        "revenue": 8399.58
      },
      {
        "productId": "prod_def456",
        "name": "Phone Case - Premium Leather",
        "unitsSold": 128,
        "revenue": 3838.72
      }
    ]
  },
  "error": null,
  "pagination": null
}
```

**Error Codes**: 400, 401, 403

---

#### Get Payouts
```
GET /store/payouts
```

**Description**: Retrieve a list of your store's payouts.

**Required Plan**: Pro, Enterprise

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page, max 100 (default: 20) |
| status | string | No | Filter by status: `pending`, `processing`, `completed`, `failed` |
| dateFrom | string | No | ISO 8601 date |
| dateTo | string | No | ISO 8601 date |

**Response Example**:
```json
{
  "success": true,
  "data": [
    {
      "id": "payout_xyz789",
      "amount": 5000.00,
      "currency": "USD",
      "status": "completed",
      "bankAccount": {
        "bankName": "First National Bank",
        "accountLast4": "****1234",
        "routingNumber": "****0001"
      },
      "period": {
        "startDate": "2026-02-14",
        "endDate": "2026-02-28"
      },
      "ordersIncluded": 95,
      "transactionFee": -150.00,
      "netAmount": 4850.00,
      "scheduledDate": "2026-03-07",
      "completedDate": "2026-03-07T09:30:00Z",
      "reference": "PAYOUT-2026-03-001"
    },
    {
      "id": "payout_abc123",
      "amount": 4500.00,
      "currency": "USD",
      "status": "pending",
      "bankAccount": {
        "bankName": "First National Bank",
        "accountLast4": "****1234",
        "routingNumber": "****0001"
      },
      "period": {
        "startDate": "2026-02-28",
        "endDate": "2026-03-14"
      },
      "ordersIncluded": 87,
      "transactionFee": -135.00,
      "netAmount": 4365.00,
      "scheduledDate": "2026-03-21",
      "completedDate": null,
      "reference": "PAYOUT-2026-03-002"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

**Error Codes**: 401, 403

---

## Webhooks (Enterprise Plan)

Webhooks allow you to receive real-time notifications about events in your store. Only available on Enterprise plan.

### Registering Webhooks

1. Log in to your Seller Dashboard
2. Go to **Settings** > **Webhooks**
3. Click **Add Webhook**
4. Enter your webhook URL (must be HTTPS)
5. Select events to subscribe to
6. Click **Save**

### Supported Events

- `order.created` - New order received
- `order.cancelled` - Order cancelled by customer or system
- `payout.completed` - Payout processed to your bank account
- `review.created` - New customer review posted

### Webhook Payload Format

All webhooks are sent as POST requests with the following structure:

```json
{
  "id": "evt_abc123",
  "type": "order.created",
  "timestamp": "2026-03-14T14:30:00Z",
  "data": {
    "id": "sub_order_abc123",
    "parentOrderId": "order_xyz789",
    "status": "pending",
    "customerName": "John Smith",
    "items": [
      {
        "productId": "prod_abc123",
        "productName": "Wireless Noise-Cancelling Headphones",
        "quantity": 1,
        "unitPrice": 199.99,
        "lineTotal": 199.99
      }
    ],
    "totalAmount": 225.99
  },
  "signature": "sha256=5d41402abc4b2a76b9719d911017c592"
}
```

### Event Examples

**order.created**:
```json
{
  "id": "evt_001",
  "type": "order.created",
  "timestamp": "2026-03-14T14:30:00Z",
  "data": {
    "id": "sub_order_abc123",
    "parentOrderId": "order_xyz789",
    "status": "pending",
    "customerName": "John Smith",
    "customerEmail": "john@example.com",
    "items": [
      {
        "productId": "prod_abc123",
        "productName": "Wireless Noise-Cancelling Headphones",
        "sku": "WNC-HDN-001",
        "quantity": 1,
        "unitPrice": 199.99,
        "lineTotal": 199.99
      }
    ],
    "subtotal": 199.99,
    "taxAmount": 16.00,
    "shippingCost": 10.00,
    "totalAmount": 225.99
  }
}
```

**payout.completed**:
```json
{
  "id": "evt_002",
  "type": "payout.completed",
  "timestamp": "2026-03-07T09:30:00Z",
  "data": {
    "id": "payout_xyz789",
    "amount": 5000.00,
    "currency": "USD",
    "status": "completed",
    "period": {
      "startDate": "2026-02-14",
      "endDate": "2026-02-28"
    },
    "ordersIncluded": 95,
    "netAmount": 4850.00,
    "completedDate": "2026-03-07T09:30:00Z"
  }
}
```

### Signature Verification

Each webhook includes an HMAC-SHA256 signature in the `signature` header for verification. To verify:

```javascript
const crypto = require('crypto');

const signature = req.headers['x-nexomarket-signature'];
const payload = JSON.stringify(req.body);
const secret = 'your_webhook_secret'; // From your webhook settings

const hash = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

const expected = `sha256=${hash}`;
const isValid = signature === expected;
```

### Retry Policy

NexoMarket will retry failed webhooks up to 3 times using exponential backoff:

- Attempt 1: Immediate
- Attempt 2: 5 seconds later
- Attempt 3: 30 seconds later

Your endpoint must respond with HTTP 200-299 status code within 30 seconds for successful receipt.

---

## Code Examples

### Creating a Product

**cURL**:
```bash
curl -X POST https://api.nexomarket.com/api/v1/products \
  -H "Authorization: Bearer sk_live_abc123xyz789" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Wireless Headphones",
    "description": "High-quality wireless headphones with 30-hour battery",
    "basePrice": 149.99,
    "compareAtPrice": 249.99,
    "cost": 60.00,
    "categoryId": "cat_electronics_001",
    "sku": "PWH-001",
    "variants": [
      {
        "name": "Black",
        "sku": "PWH-001-BLK",
        "price": 149.99,
        "stock": 50,
        "attributes": {"color": "Black"}
      }
    ]
  }'
```

**JavaScript (fetch)**:
```javascript
const apiKey = 'sk_live_abc123xyz789';

const product = {
  name: 'Premium Wireless Headphones',
  description: 'High-quality wireless headphones with 30-hour battery',
  basePrice: 149.99,
  compareAtPrice: 249.99,
  cost: 60.00,
  categoryId: 'cat_electronics_001',
  sku: 'PWH-001',
  variants: [
    {
      name: 'Black',
      sku: 'PWH-001-BLK',
      price: 149.99,
      stock: 50,
      attributes: { color: 'Black' }
    }
  ]
};

fetch('https://api.nexomarket.com/api/v1/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(product)
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Product created:', data.data.id);
    } else {
      console.error('Error:', data.error);
    }
  });
```

**Python (requests)**:
```python
import requests
import json

api_key = 'sk_live_abc123xyz789'
base_url = 'https://api.nexomarket.com/api/v1'

product = {
    'name': 'Premium Wireless Headphones',
    'description': 'High-quality wireless headphones with 30-hour battery',
    'basePrice': 149.99,
    'compareAtPrice': 249.99,
    'cost': 60.00,
    'categoryId': 'cat_electronics_001',
    'sku': 'PWH-001',
    'variants': [
        {
            'name': 'Black',
            'sku': 'PWH-001-BLK',
            'price': 149.99,
            'stock': 50,
            'attributes': {'color': 'Black'}
        }
    ]
}

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.post(
    f'{base_url}/products',
    headers=headers,
    json=product
)

result = response.json()
if result['success']:
    print(f"Product created: {result['data']['id']}")
else:
    print(f"Error: {result['error']}")
```

---

### Listing Orders

**cURL**:
```bash
curl -X GET "https://api.nexomarket.com/api/v1/orders?status=pending&limit=20" \
  -H "Authorization: Bearer sk_live_abc123xyz789"
```

**JavaScript (fetch)**:
```javascript
const apiKey = 'sk_live_abc123xyz789';

fetch('https://api.nexomarket.com/api/v1/orders?status=pending&limit=20', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log(`Found ${data.pagination.total} pending orders`);
      data.data.forEach(order => {
        console.log(`Order ${order.id}: ${order.customerName} - $${order.totalAmount}`);
      });
    }
  });
```

**Python (requests)**:
```python
import requests

api_key = 'sk_live_abc123xyz789'
base_url = 'https://api.nexomarket.com/api/v1'

headers = {'Authorization': f'Bearer {api_key}'}

response = requests.get(
    f'{base_url}/orders',
    headers=headers,
    params={'status': 'pending', 'limit': 20}
)

data = response.json()
if data['success']:
    print(f"Found {data['pagination']['total']} pending orders")
    for order in data['data']:
        print(f"Order {order['id']}: {order['customerName']} - ${order['totalAmount']}")
```

---

### Generating a Shipping Label

**cURL**:
```bash
curl -X POST https://api.nexomarket.com/api/v1/shipping/labels \
  -H "Authorization: Bearer sk_live_abc123xyz789" \
  -H "Content-Type: application/json" \
  -d '{
    "subOrderId": "sub_order_abc123",
    "rateId": "rate_001",
    "addressFrom": {
      "name": "Your Store",
      "street": "789 Commerce St",
      "city": "Chicago",
      "state": "IL",
      "postalCode": "60601",
      "country": "US",
      "phone": "+1234567890"
    },
    "addressTo": {
      "name": "John Smith",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US",
      "phone": "+1987654321"
    },
    "parcels": [
      {
        "length": 30,
        "width": 20,
        "height": 10,
        "lengthUnit": "cm",
        "weight": 0.5,
        "weightUnit": "kg"
      }
    ]
  }'
```

**JavaScript (fetch)**:
```javascript
const apiKey = 'sk_live_abc123xyz789';

const labelRequest = {
  subOrderId: 'sub_order_abc123',
  rateId: 'rate_001',
  addressFrom: {
    name: 'Your Store',
    street: '789 Commerce St',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60601',
    country: 'US',
    phone: '+1234567890'
  },
  addressTo: {
    name: 'John Smith',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US',
    phone: '+1987654321'
  },
  parcels: [
    {
      length: 30,
      width: 20,
      height: 10,
      lengthUnit: 'cm',
      weight: 0.5,
      weightUnit: 'kg'
    }
  ]
};

fetch('https://api.nexomarket.com/api/v1/shipping/labels', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(labelRequest)
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Label generated:', data.data.labelUrl);
      console.log('Tracking:', data.data.trackingNumber);
    }
  });
```

**Python (requests)**:
```python
import requests

api_key = 'sk_live_abc123xyz789'
base_url = 'https://api.nexomarket.com/api/v1'

label_request = {
    'subOrderId': 'sub_order_abc123',
    'rateId': 'rate_001',
    'addressFrom': {
        'name': 'Your Store',
        'street': '789 Commerce St',
        'city': 'Chicago',
        'state': 'IL',
        'postalCode': '60601',
        'country': 'US',
        'phone': '+1234567890'
    },
    'addressTo': {
        'name': 'John Smith',
        'street': '123 Main St',
        'city': 'New York',
        'state': 'NY',
        'postalCode': '10001',
        'country': 'US',
        'phone': '+1987654321'
    },
    'parcels': [
        {
            'length': 30,
            'width': 20,
            'height': 10,
            'lengthUnit': 'cm',
            'weight': 0.5,
            'weightUnit': 'kg'
        }
    ]
}

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.post(
    f'{base_url}/shipping/labels',
    headers=headers,
    json=label_request
)

data = response.json()
if data['success']:
    print(f"Label URL: {data['data']['labelUrl']}")
    print(f"Tracking: {data['data']['trackingNumber']}")
```

---

### Uploading a Product Image

**cURL**:
```bash
# First, encode your image to base64
BASE64_IMAGE=$(base64 -i /path/to/image.jpg)

curl -X POST https://api.nexomarket.com/api/v1/products/prod_abc123/images \
  -H "Authorization: Bearer sk_live_abc123xyz789" \
  -H "Content-Type: application/json" \
  -d "{
    \"data\": \"$BASE64_IMAGE\",
    \"altText\": \"Product front view\",
    \"isPrimary\": true
  }"
```

**JavaScript (fetch)**:
```javascript
const apiKey = 'sk_live_abc123xyz789';

// Function to convert file to base64
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}

// Upload image
async function uploadProductImage(productId, imageFile) {
  const base64Data = await fileToBase64(imageFile);

  const payload = {
    data: base64Data,
    altText: 'Product front view',
    isPrimary: true
  };

  const response = await fetch(
    `https://api.nexomarket.com/api/v1/products/${productId}/images`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();
  if (data.success) {
    console.log('Image uploaded:', data.data.url);
  }
}

// Usage
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', (e) => {
  uploadProductImage('prod_abc123', e.target.files[0]);
});
```

**Python (requests)**:
```python
import requests
import base64

api_key = 'sk_live_abc123xyz789'
base_url = 'https://api.nexomarket.com/api/v1'
product_id = 'prod_abc123'

# Read and encode image
with open('/path/to/image.jpg', 'rb') as img_file:
    base64_data = base64.b64encode(img_file.read()).decode('utf-8')

payload = {
    'data': base64_data,
    'altText': 'Product front view',
    'isPrimary': True
}

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.post(
    f'{base_url}/products/{product_id}/images',
    headers=headers,
    json=payload
)

data = response.json()
if data['success']:
    print(f"Image uploaded: {data['data']['url']}")
```

---

## Rate Limits & Errors

### Rate Limit Headers

All responses include rate limit information in the headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1678876800
```

- **X-RateLimit-Limit**: Maximum requests allowed in current window
- **X-RateLimit-Remaining**: Requests remaining in current window
- **X-RateLimit-Reset**: Unix timestamp when the rate limit resets

### Error Codes

| Code | Status | Description | Solution |
|------|--------|-------------|----------|
| 400 | Bad Request | Invalid request parameters or malformed JSON | Check request format and required fields |
| 401 | Unauthorized | Missing or invalid API key | Generate a new API key |
| 403 | Forbidden | Access denied (insufficient plan or permissions) | Upgrade your plan or contact support |
| 404 | Not Found | Resource not found | Verify the resource ID exists |
| 409 | Conflict | Resource already exists or operation not allowed | Check resource state before operation |
| 422 | Unprocessable Entity | Request body valid but contains invalid data | Validate field values and constraints |
| 429 | Too Many Requests | Rate limit exceeded | Wait before making additional requests |
| 500 | Server Error | Internal server error | Retry after a short delay |

### Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "data": null,
  "error": "Detailed error message",
  "pagination": null
}
```

### Common Error Scenarios

**Missing API Key**:
```json
{
  "success": false,
  "data": null,
  "error": "Missing Authorization header"
}
```

**Invalid Product Data**:
```json
{
  "success": false,
  "data": null,
  "error": "Validation failed: basePrice must be greater than 0, description is required"
}
```

**Rate Limit Exceeded**:
```json
{
  "success": false,
  "data": null,
  "error": "Rate limit exceeded. Maximum 100 requests per minute allowed."
}
```

---

## Best Practices

1. **Store API Key Securely**: Use environment variables, not hardcoded values
2. **Use Pagination**: Always handle paginated responses correctly
3. **Implement Retry Logic**: Use exponential backoff for failed requests
4. **Monitor Rate Limits**: Check headers to avoid hitting limits
5. **Validate Input**: Validate all data before sending to the API
6. **Handle Errors**: Implement proper error handling and logging
7. **Use Webhooks**: Subscribe to events instead of polling when possible
8. **Test First**: Use sandbox/staging before production changes
9. **Keep Software Updated**: Update API client libraries regularly
10. **Log API Calls**: Maintain logs of all API interactions for debugging

---

## Support

For API support and questions:
- Email: api-support@nexomarket.com
- Documentation: https://docs.nexomarket.com
- Status Page: https://status.nexomarket.com
- Community Forum: https://forum.nexomarket.com
