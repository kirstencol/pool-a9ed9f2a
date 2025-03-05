
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
  userId?: string;
  responderName?: string;
  available?: boolean;
  selectedStartTime?: string;
  selectedEndTime?: string;
  startTime?: string;
  endTime?: string;
  note?: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  suggestedBy: string;
  responses?: LocationResponse[];
}

export interface LocationWithNote {
  name: string;
  note: string;
  selected: boolean;
  userNote?: string;
  abbyComment?: string;
}

export interface LocationWithComments extends LocationWithNote {
  abbyComment: string; // Required in LocationWithComments
}

export interface LocationResponse {
  userId: string;
  responderName?: string;
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
