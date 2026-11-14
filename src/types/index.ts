export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

export interface TicketTier {
  _id: string;
  name: string;
  price: number;
  totalQuota: number;
  availableQuota: number;
  perks: string[];
}

export interface Order {
  _id: string;
  userId: string;
  tierId: string;
  tierName: string;
  quantity: number;
  totalAmount: number;
  status: "paid" | "cancelled";
  ticketCodes: string[];
  createdAt: string;
}

export interface Lineup {
  _id: string;
  artistName: string;
  day: number;
  stage: string;
  timeSlot: string;
  imageUrl: string;
  description: string;
}

