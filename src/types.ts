export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  image: string;
  features: string[];
}

export interface CartItem {
  service: ServiceItem;
  quantity: number;
  notes?: string;
}

export interface PartnerInfo {
  name: string;
  rating: number;
  photo: string;
  contact: string;
  vehicleNumber: string;
}

export type BookingStatus =
  | 'idle'
  | 'reviewing'
  | 'confirmed'
  | 'partner_assigned'
  | 'arriving'
  | 'in_progress'
  | 'completed';

export interface Booking {
  id: string;
  status: BookingStatus;
  items: CartItem[];
  dateSlot: string;
  timeSlot: string;
  address: {
    fullName: string;
    phone: string;
    flatRoom: string;
    area: string;
    landmark?: string;
  };
  partner?: PartnerInfo;
  createdAt: string;
  totalAmount: number;
}

export interface DiagnosticsRecommendation {
  problemType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: string;
  suggestedServiceIds: string[];
  advice: string[];
  diagnosisExplanation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendations?: DiagnosticsRecommendation;
}
