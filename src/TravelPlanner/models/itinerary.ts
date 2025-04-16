import { Destination } from './destination';

export interface ItineraryDay {
  id: string;
  day: number;
  date: string;
  destinations: Destination[];
  notes: string;
}

export interface Itinerary {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
  budget: number;
  expenses: {
    accommodation: number;
    food: number;
    transportation: number;
    activities: number;
    other: number;
  };
} 