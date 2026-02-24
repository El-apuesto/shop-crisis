export interface Product {
  id: string;
  name: string;
  runNumber: string;
  description: string;
  fullDescription: string;
  originalPrice: number;
  salePrice: number;
  images: string[];
  colors: string[];
  sizes: string[];
  inStock: boolean;
  isArchived?: boolean;
  chaosLevel?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Popup {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'chaos';
  buttons?: PopupButton[];
  onClose?: () => void;
}

export interface PopupButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
}

export interface CrisisConfession {
  id: string;
  name: string;
  reason: string;
  exName: string;
  timestamp: number;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super' | 'admin';
  permissions: string[];
}

export interface CrisisMetrics {
  totalSales: number;
  cartAbandonment: number;
  popupDismissalRate: number;
  averageChaosLevel: number;
  activeUsers: number;
}

export type ViewState = 'landing' | 'product' | 'archives' | 'checkout' | 'admin' | 'contact';
