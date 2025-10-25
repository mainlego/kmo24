// ===== USER TYPES =====

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  role: 'user' | 'admin' | 'manager';
  avatar?: string;
  isEmailVerified: boolean;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  _id?: string;
  type: 'home' | 'work' | 'other';
  country?: string;
  city: string;
  street?: string;
  building?: string;
  apartment?: string;
  postalCode?: string;
  isDefault: boolean;
}

// ===== AUTH TYPES =====

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// ===== PRODUCT TYPES =====

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: {
    short?: string;
    full?: string;
  };
  category: Category | string;
  price: number;
  oldPrice?: number;
  discountPercent: number;
  stock: {
    quantity: number;
    reserved: number;
    available: number;
  };
  status: 'available' | 'out_of_stock' | 'on_order' | 'discontinued';
  images: ProductImage[];
  videos?: ProductVideo[];
  specifications?: Specification[];
  variants?: ProductVariant[];
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  relatedProducts?: RelatedProduct[];
  rating: {
    average: number;
    count: number;
  };
  stats: {
    views: number;
    purchases: number;
    addedToCart: number;
    addedToWishlist: number;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVideo {
  url: string;
  title?: string;
  thumbnail?: string;
}

export interface Specification {
  name: string;
  value: string;
  unit?: string;
  group?: string;
}

export interface ProductVariant {
  name: string;
  options: VariantOption[];
}

export interface VariantOption {
  value: string;
  sku?: string;
  price?: number;
  stock?: number;
  image?: string;
}

export interface RelatedProduct {
  product: Product | string;
  type: 'cross_sell' | 'up_sell' | 'similar' | 'accessories';
}

// ===== CATEGORY TYPES =====

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: Category | string | null;
  level: number;
  image?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// ===== CART TYPES =====

export interface Cart {
  _id?: string;
  user?: string;
  sessionId?: string;
  items: CartItem[];
  promoCode?: PromoCode;
  totalItems: number;
  subtotal: number;
  total: number;
  expiresAt?: string;
}

export interface CartItem {
  _id?: string;
  product: Product;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
  price: number;
  addedAt?: string;
}

export interface PromoCode {
  code: string;
  discount: number;
  expiresAt: string;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
}

// ===== ORDER TYPES =====

export interface Order {
  _id: string;
  orderNumber: string;
  user?: string;
  customer: CustomerInfo;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shipping: ShippingInfo;
  payment: PaymentInfo;
  pricing: OrderPricing;
  promoCode?: PromoCode;
  status: OrderStatus;
  statusHistory: StatusHistory[];
  customerComment?: string;
  adminComment?: string;
  isPaid: boolean;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OrderItem {
  product: Product | string;
  name: string;
  sku: string;
  image?: string;
  variant?: {
    name: string;
    value: string;
  };
  quantity: number;
  price: number;
  total: number;
}

export interface ShippingAddress {
  country?: string;
  city: string;
  street?: string;
  building?: string;
  apartment?: string;
  postalCode?: string;
  comment?: string;
}

export interface ShippingInfo {
  method: 'pickup' | 'dellin' | 'pek' | 'courier';
  company?: string;
  trackingNumber?: string;
  cost: number;
  estimatedDelivery?: string;
  actualDelivery?: string;
  terminal?: {
    id: string;
    address: string;
  };
}

export interface PaymentInfo {
  method: 'cash' | 'card' | 'online' | 'bank_transfer';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paidAt?: string;
  transactionId?: string;
}

export interface OrderPricing {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface StatusHistory {
  status: OrderStatus;
  comment?: string;
  createdAt: string;
  updatedBy?: string;
}

// ===== REVIEW TYPES =====

export interface Review {
  _id: string;
  product: Product | string;
  user: User | string;
  order?: string;
  rating: number;
  title?: string;
  comment: string;
  pros?: string;
  cons?: string;
  images?: ReviewImage[];
  isApproved: boolean;
  helpful: number;
  unhelpful: number;
  response?: ReviewResponse;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewImage {
  url: string;
  alt?: string;
}

export interface ReviewResponse {
  text: string;
  respondedBy: User | string;
  respondedAt: string;
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ===== FILTER TYPES =====

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
}
