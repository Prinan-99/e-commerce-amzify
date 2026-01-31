
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'electronics' | 'fashion' | 'home' | 'accessories';
  images: string[];
  rating: number;
  featured?: boolean;
  stock?: number;
  sales?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SellerStat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  address: string;
  phone?: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled' | 'In Transit' | 'Out for Delivery';
  items: CartItem[];
  trackingId?: string;
  carrier?: string;
  lastUpdate?: string;
  trackingHistory?: TrackingEvent[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastPurchase: string;
  status: 'Active' | 'Restricted';
}

export interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  date: string;
  status: 'pending' | 'resolved';
  reply?: string;
}

export type SellerTab = 'dashboard' | 'inventory' | 'orders' | 'marketing' | 'tracking' | 'profile' | 'customers' | 'support';

export interface Campaign {
  id: string;
  name: string;
  platform: 'Instagram' | 'Email' | 'Google' | 'Meta';
  status: 'Active' | 'Draft' | 'Scheduled' | 'Completed';
  reach: number;
  engagement: string;
  product: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'abandonment' | 'purchase' | 'welcome' | 'vip';
  active: boolean;
  lastSent?: string;
  stats?: {
    delivered: number;
    opened: number;
  };
}
