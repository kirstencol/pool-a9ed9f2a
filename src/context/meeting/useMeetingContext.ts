
// src/context/meeting/useMeetingContext.ts
import { useContext } from 'react';
import MeetingContext from './MeetingContextDefinition';

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    console.error("useMeeting must be used within a MeetingProvider");
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};
