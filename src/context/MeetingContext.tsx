
import { createContext, useContext, useState, ReactNode } from 'react';
import { User, TimeSlot, Location, Meeting } from '@/types';

interface MeetingContextType {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  participants: User[];
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
  timeSlots: TimeSlot[];
  addTimeSlot: (timeSlot: TimeSlot) => void;
  removeTimeSlot: (id: string) => void;
  updateTimeSlot: (id: string, updates: Partial<TimeSlot>) => void;
  selectedTimeSlot: TimeSlot | null;
  setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void;
  locations: Location[];
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  meetingNotes: string;
  setMeetingNotes: (notes: string) => void;
  clearMeetingData: () => void;
  getMeetingData: () => Partial<Meeting>;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const MeetingProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [meetingNotes, setMeetingNotes] = useState<string>('');

  const addParticipant = (name: string) => {
    const newParticipant: User = {
      id: crypto.randomUUID(),
      name,
      initial: name.charAt(0).toUpperCase(),
    };
    setParticipants([...participants, newParticipant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const addTimeSlot = (timeSlot: TimeSlot) => {
    setTimeSlots([...timeSlots, { ...timeSlot, id: crypto.randomUUID() }]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(ts => ts.id !== id));
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    setTimeSlots(timeSlots.map(ts => 
      ts.id === id ? { ...ts, ...updates } : ts
    ));
  };

  const addLocation = (location: Location) => {
    setLocations([...locations, { ...location, id: crypto.randomUUID() }]);
  };

  const removeLocation = (id: string) => {
    setLocations(locations.filter(l => l.id !== id));
  };

  const clearMeetingData = () => {
    setParticipants([]);
    setTimeSlots([]);
    setSelectedTimeSlot(null);
    setLocations([]);
    setSelectedLocation(null);
    setMeetingNotes('');
  };

  const getMeetingData = (): Partial<Meeting> => {
    if (!currentUser) return {};
    
    return {
      creator: currentUser,
      participants,
      timeSlots,
      selectedTimeSlot,
      locations,
      selectedLocation,
      notes: meetingNotes,
      status: selectedLocation ? 'confirmed' : selectedTimeSlot ? 'pending' : 'draft'
    };
  };

  return (
    <MeetingContext.Provider value={{
      currentUser,
      setCurrentUser,
      participants,
      addParticipant,
      removeParticipant,
      timeSlots,
      addTimeSlot,
      removeTimeSlot,
      updateTimeSlot,
      selectedTimeSlot,
      setSelectedTimeSlot,
      locations,
      addLocation,
      removeLocation,
      selectedLocation,
      setSelectedLocation,
      meetingNotes,
      setMeetingNotes,
      clearMeetingData,
      getMeetingData
    }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};
