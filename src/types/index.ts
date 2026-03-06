// Product Types
export interface Product {
  _id: string;
  id?: string; // Optional for compatibility
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  brand: string;
  sku: string;
  status: 'Active' | 'Draft' | 'OOS';
}

// Store Types
export interface OperatingHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

export interface Store {
  _id: string;
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactNumber: string;
  email: string;
  images: string[];
  operatingHours: OperatingHours;
  mapUrl: string;
  status: 'Open' | 'Closed' | 'Renovation';
  statusMode?: 'Auto' | 'Manual';
}

// Navigation Types
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

// Form Types
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  brand: string;
  status: 'Active' | 'Draft' | 'OOS';
  images: File[];
}

export interface StoreFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactNumber: string;
  email: string;
  mapUrl: string;
  status: 'Open' | 'Closed' | 'Renovation';
  statusMode?: 'Auto' | 'Manual';
  images: File[];
  operatingHours: OperatingHours;
}
export interface User {
  _id: string;
  fullName: string;
  Email: string;
  Phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  status: 'Pending' | 'Cancelled' | 'Accepted';
}

export interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'Pending' | 'Success' | 'Failed';
  razorpayOrderId: string;
  createdAt: string;
  address: any; // Can be typed more specifically if needed
}

export interface Appointment {
  _id: string;
  fullName: string;
  phone: string;
  date: string;
  slot: {
    _id: string;
    time: string;
  };
  store: Store;
  status: 'pending' | 'confirmed' | 'cancelled';
  language: {
    _id: string;
    name: string;
  };
  user?: User;
  additionalNotes?: string;
  createdAt: string;
}

export interface Banner {
  _id: string;
  imageUrl: string;
  status: 'Active' | 'Inactive';
  priority: number;
  createdAt: string;
  updatedAt: string;
}
