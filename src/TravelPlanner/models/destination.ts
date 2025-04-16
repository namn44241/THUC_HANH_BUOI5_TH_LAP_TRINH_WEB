export interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  price: number;
  type: 'beach' | 'mountain' | 'city';
  activities: string[];
  duration: number; // Thời gian tham quan trung bình (giờ)
} 