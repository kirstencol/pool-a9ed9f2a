
export interface User {
  id: string;
  name: string;
  initial: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  responses?: UserResponse[];
}

export interface UserResponse {
  userId: string;
  available: boolean;
  selectedStartTime?: string;
  selectedEndTime?: string;
  note?: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  suggestedBy: string;
  responses?: LocationResponse[];
}

export interface LocationResponse {
  userId: string;
  note?: string;
}

export interface Meeting {
  id: string;
  creator: User;
  participants: User[];
  timeSlots: TimeSlot[];
  selectedTimeSlot?: TimeSlot;
  locations?: Location[];
  selectedLocation?: Location;
  notes?: string;
  status: 'draft' | 'pending' | 'confirmed';
}
