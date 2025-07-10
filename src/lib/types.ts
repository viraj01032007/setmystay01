
export type Page = 'home' | 'pg' | 'rentals' | 'roommates' | 'list' | 'your-properties';

export type ListingType = 'pg' | 'rental' | 'roommate';

export interface Bed {
  id: string;
  status: 'vacant' | 'occupied';
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  'data-ai-hint'?: string;
}

export interface Coupon {
    id: string;
    code: string;
    discountPercentage: number;
    isActive: boolean;
}

export interface Listing {
  id: string;
  propertyType: 'PG' | 'Rental';
  title: string;
  rent: number;
  area: number;
  city: string;
  locality: string;
  state: string;
  completeAddress: string;
  partialAddress: string;
  ownerName: string;
  contactPhonePrimary: string;
  contactPhoneSecondary?: string;
  contactEmail?: string;
  description: string;
  furnishedStatus: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  amenities: string[];
  size: string; // e.g., '1 BHK', 'Single Room'
  images: string[];
  videoUrl?: string;
  views: number;
  ownerId: string;
  'data-ai-hint'?: string;
  brokerStatus: 'With Broker' | 'Without Broker';
  verificationDocumentUrl?: string;
  beds?: Bed[];
}

export interface RoommateProfile {
  id: string;
  propertyType: 'Roommate'; // To distinguish from listings
  ownerName: string;
  age: number;
  rent: number; // Budget
  city: string;
  locality: string;
  state: string;
  completeAddress: string;
  partialAddress: string;
  contactPhonePrimary: string;
  contactPhoneSecondary?: string;
  contactEmail?: string;
  description: string;
  preferences: string[];
  gender: string;
  images: string[];
  views: number;
  ownerId: string;
  'data-ai-hint'?: string;
  verificationDocumentUrl?: string;
  hasProperty: boolean;
}

export type UnlockPlan = 1 | 5 | 10 | 'unlimited';

export type FilterState = {
  budget: number;
  amenities: string[];
  furnishedStatus: string;
  propertyType: string;
  state: string;
  city: string;
  locality: string;
  roomType: string;
  gender: string;
  brokerStatus: string;
};
