
export interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  image: string;
  description: string;
}

export interface QuotationRequest {
  productId: string;
  quantity: number;
}

export interface DistributorQuotation {
  distributorName: string;
  productId: string;
  pricePerUnit: number;
  availability: number;
  estimatedDeliveryDays: number;
  quotationId: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedDistributor?: string;
  finalPrice?: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: 'Pending' | 'Quoting' | 'Comparing' | 'Confirmed' | 'Shipped' | 'Delivered';
  totalAmount: number;
  createdAt: string;
  trackingId?: string;
}

export interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'passed' | 'failed';
  message: string;
  duration: number;
}

export enum ViewState {
  CATALOG = 'catalog',
  CART = 'cart',
  CHECKOUT_PROCESS = 'checkout_process',
  ORDERS = 'orders',
  ARCHITECTURE = 'architecture',
  TESTING = 'testing'
}
