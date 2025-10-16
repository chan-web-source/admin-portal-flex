export interface PropertyData {
 id: string;
 name: string;
 location: string;
 city: 'London' | 'Paris' | 'Algiers';
 type: 'Apartment' | 'Studio' | 'House';
 bedrooms: number;
 bathrooms: number;
 rating: number;
 totalReviews: number;
 occupancyRate: number;
 revenue: number;
 revenueChange: number;
 lastUpdated: string;
 status: 'Active' | 'Maintenance' | 'Vacant';
 image: string;
}

export interface ReviewData {
 id: string;
 propertyId: string;
 propertyName: string;
 guestName: string;
 rating: number;
 comment: string;
 channel: 'Booking.com' | 'Airbnb' | 'Direct' | 'Google';
 category: 'Cleanliness' | 'Location' | 'Value' | 'Communication' | 'Check-in';
 submittedAt: string;
 isApproved: boolean;
 isPublic: boolean;
 managerNotes?: string;
}

export interface DashboardStats {
 totalRevenue: number;
 revenueChange: number;
 totalProperties: number;
 propertiesChange: number;
 totalReviews: number;
 reviewsChange: number;
 averageRating: number;
 ratingChange: number;
 occupancyRate: number;
 occupancyChange: number;
 responseRate: number;
 responseChange: number;
 pendingReviews: number;
 approvedReviews: number;
 rejectedReviews: number;
}

export const mockProperties: PropertyData[] = [
 {
  id: 'prop-1',
  name: '2B N1 A - 29 Shoreditch Heights',
  location: 'Shoreditch, London',
  city: 'London',
  type: 'Apartment',
  bedrooms: 2,
  bathrooms: 2,
  rating: 4.8,
  totalReviews: 24,
  occupancyRate: 92,
  revenue: 15420,
  revenueChange: 12.5,
  lastUpdated: '2024-01-15',
  status: 'Active',
  image: '/modern-london-apartment-exterior.jpg'
 },
 {
  id: 'prop-2',
  name: '1B E1 B - 15 Canary Wharf Tower',
  location: 'Canary Wharf, London',
  city: 'London',
  type: 'Apartment',
  bedrooms: 1,
  bathrooms: 1,
  rating: 4.9,
  totalReviews: 18,
  occupancyRate: 88,
  revenue: 12850,
  revenueChange: 8.3,
  lastUpdated: '2024-01-14',
  status: 'Active',
  image: '/luxury-canary-wharf-apartment.jpg'
 },
 {
  id: 'prop-3',
  name: 'Studio W1 C - 42 Fitzrovia Square',
  location: 'Fitzrovia, London',
  city: 'London',
  type: 'Studio',
  bedrooms: 0,
  bathrooms: 1,
  rating: 4.7,
  totalReviews: 31,
  occupancyRate: 85,
  revenue: 9650,
  revenueChange: -2.1,
  lastUpdated: '2024-01-13',
  status: 'Active',
  image: '/stylish-fitzrovia-studio-apartment.jpg'
 },
 {
  id: 'prop-4',
  name: '3B Champs-Élysées - 15 Avenue',
  location: 'Champs-Élysées, Paris',
  city: 'Paris',
  type: 'Apartment',
  bedrooms: 3,
  bathrooms: 2,
  rating: 4.6,
  totalReviews: 12,
  occupancyRate: 78,
  revenue: 18750,
  revenueChange: 15.2,
  lastUpdated: '2024-01-12',
  status: 'Active',
  image: '/modern-furnished-apartment-living-room.jpg'
 },
 {
  id: 'prop-5',
  name: '2B Algiers Center - 8 Rue Didouche',
  location: 'Algiers Center, Algiers',
  city: 'Algiers',
  type: 'Apartment',
  bedrooms: 2,
  bathrooms: 1,
  rating: 4.4,
  totalReviews: 8,
  occupancyRate: 65,
  revenue: 4200,
  revenueChange: 22.8,
  lastUpdated: '2024-01-11',
  status: 'Active',
  image: '/modern-apartment-bedroom-with-natural-light.jpg'
 },
 {
  id: 'prop-6',
  name: '1B Marais - 22 Rue des Archives',
  location: 'Le Marais, Paris',
  city: 'Paris',
  type: 'Apartment',
  bedrooms: 1,
  bathrooms: 1,
  rating: 4.5,
  totalReviews: 15,
  occupancyRate: 82,
  revenue: 11200,
  revenueChange: 5.7,
  lastUpdated: '2024-01-10',
  status: 'Maintenance',
  image: '/stylish-bedroom-with-yellow-accents-and-artwork.jpg'
 }
];

export const mockReviews: ReviewData[] = [
 {
  id: 'rev-1',
  propertyId: 'prop-1',
  propertyName: '2B N1 A - 29 Shoreditch Heights',
  guestName: 'Sarah Johnson',
  rating: 5,
  comment: 'Absolutely perfect stay! The apartment was spotless and the location was ideal for exploring London.',
  channel: 'Booking.com',
  category: 'Cleanliness',
  submittedAt: '2024-01-15T10:30:00Z',
  isApproved: true,
  isPublic: true
 },
 {
  id: 'rev-2',
  propertyId: 'prop-1',
  propertyName: '2B N1 A - 29 Shoreditch Heights',
  guestName: 'Michael Chen',
  rating: 4,
  comment: 'Great location and well-equipped apartment. Only minor issue was the WiFi speed.',
  channel: 'Airbnb',
  category: 'Location',
  submittedAt: '2024-01-14T15:45:00Z',
  isApproved: true,
  isPublic: true
 },
 {
  id: 'rev-3',
  propertyId: 'prop-2',
  propertyName: '1B E1 B - 15 Canary Wharf Tower',
  guestName: 'Emma Wilson',
  rating: 5,
  comment: 'Luxury apartment with amazing views. Everything was perfect!',
  channel: 'Direct',
  category: 'Value',
  submittedAt: '2024-01-13T09:20:00Z',
  isApproved: true,
  isPublic: true
 },
 {
  id: 'rev-4',
  propertyId: 'prop-3',
  propertyName: 'Studio W1 C - 42 Fitzrovia Square',
  guestName: 'David Brown',
  rating: 3,
  comment: 'The studio was smaller than expected and quite noisy at night.',
  channel: 'Google',
  category: 'Communication',
  submittedAt: '2024-01-12T14:15:00Z',
  isApproved: false,
  isPublic: false,
  managerNotes: 'Need to address noise issues and update listing description'
 },
 {
  id: 'rev-5',
  propertyId: 'prop-4',
  propertyName: '3B Champs-Élysées - 15 Avenue',
  guestName: 'Sophie Martin',
  rating: 4,
  comment: 'Beautiful apartment in perfect location. Check-in process was smooth.',
  channel: 'Booking.com',
  category: 'Check-in',
  submittedAt: '2024-01-11T11:30:00Z',
  isApproved: true,
  isPublic: true
 },
 {
  id: 'rev-6',
  propertyId: 'prop-5',
  propertyName: '2B Algiers Center - 8 Rue Didouche',
  guestName: 'Ahmed Benali',
  rating: 4,
  comment: 'Good value for money. Clean and comfortable apartment.',
  channel: 'Direct',
  category: 'Value',
  submittedAt: '2024-01-10T16:45:00Z',
  isApproved: true,
  isPublic: true
 }
];

export const mockDashboardStats: DashboardStats = {
 totalRevenue: 72370,
 revenueChange: 8.7,
 totalProperties: 6,
 propertiesChange: 0,
 totalReviews: 108,
 reviewsChange: 15.2,
 averageRating: 4.6,
 ratingChange: 0.3,
 occupancyRate: 82,
 occupancyChange: 5.2,
 responseRate: 94,
 responseChange: 2.1,
 pendingReviews: 3,
 approvedReviews: 95,
 rejectedReviews: 10
};
