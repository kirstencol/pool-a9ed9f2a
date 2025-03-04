import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, TimeSlot, Location, Meeting } from '@/types';

interface StoredMeeting {
  id?: string;
  creator?: User;
  timeSlots?: TimeSlot[];
  selectedTimeSlot?: TimeSlot | null;
  locations?: Location[];
  selectedLocation?: Location | null;
  notes?: string;
  responses?: {
    name: string;
    timeSlotId: string;
    startTime: string;
    endTime: string;
  }[];
}

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
  clearTimeSlots: () => void;
  getMeetingData: () => Partial<Meeting>;
  generateShareableLink: () => { id: string, url: string };
  storeMeetingInStorage: (id: string, meeting: StoredMeeting) => void;
  loadMeetingFromStorage: (id: string) => StoredMeeting | null;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'meetup_app_';

export const MeetingProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [meetingNotes, setMeetingNotes] = useState<string>('');
  const [currentMeetingId, setCurrentMeetingId] = useState<string>('');

  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const storeMeetingInStorage = (id: string, meeting: StoredMeeting) => {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${id}`;
      localStorage.setItem(storageKey, JSON.stringify(meeting));
      console.log(`Meeting data stored with key: ${storageKey}`);
      return true;
    } catch (error) {
      console.error('Error storing meeting data:', error);
      return false;
    }
  };

  const loadMeetingFromStorage = (id: string): StoredMeeting | null => {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${id}`;
      const storedData = localStorage.getItem(storageKey);
      
      if (!storedData) return null;
      
      return JSON.parse(storedData) as StoredMeeting;
    } catch (error) {
      console.error('Error loading meeting data:', error);
      return null;
    }
  };

  const generateShareableLink = () => {
    const meetingId = currentMeetingId || generateUniqueId();
    
    if (!currentMeetingId) {
      setCurrentMeetingId(meetingId);
    }
    
    const meetingData = getMeetingData();
    
    storeMeetingInStorage(meetingId, meetingData);
    
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/respond/${meetingId}`;
    
    return { id: meetingId, url: shareableUrl };
  };

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
    console.log("Adding time slot:", timeSlot);
    setTimeSlots(prev => [...prev, { ...timeSlot, id: timeSlot.id || crypto.randomUUID() }]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(ts => ts.id !== id));
  };

  const clearTimeSlots = () => {
    setTimeSlots([]);
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
    setCurrentMeetingId('');
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
      clearTimeSlots,
      getMeetingData,
      generateShareableLink,
      storeMeetingInStorage,
      loadMeetingFromStorage
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
