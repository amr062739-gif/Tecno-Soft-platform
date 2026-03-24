import { Timestamp } from 'firebase/firestore';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Timestamp;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  price: number;
  isFree: boolean;
  category: string;
  createdAt: Timestamp;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod?: string;
  paymentImage?: string;
  createdAt: Timestamp;
}

export interface ChatbotKnowledge {
  id: string;
  question: string;
  answer: string;
  createdAt: Timestamp;
}

export interface SiteSettings {
  logoUrl: string;
  facebookUrl?: string;
  whatsappNumber?: string;
  updatedAt: Timestamp;
}

export interface Advertisement {
  id: string;
  imageUrl: string;
  linkUrl?: string;
  createdAt: Timestamp;
}
