
// src/context/meeting/MeetingContextDefinition.ts
import { createContext } from 'react';
import { MeetingContextType } from './types';

// Create context with undefined default value
const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export default MeetingContext;
