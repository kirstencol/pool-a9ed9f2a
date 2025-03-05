
// src/context/meeting/userOperations.ts
import { User } from '@/types';
import { MeetingContextState, UserOperations } from './types';

type StateSetters = {
  setCurrentUser: (user: User | null) => void;
  setParticipants: (participants: User[]) => void;
  [key: string]: any;
};

export const useUserOperations = (
  state: MeetingContextState,
  stateSetters: StateSetters
): UserOperations => {
  const { setCurrentUser, setParticipants } = stateSetters;

  const addParticipant = (name: string) => {
    const newParticipant: User = {
      id: crypto.randomUUID(),
      name,
      initial: name.charAt(0).toUpperCase(),
    };
    setParticipants([...state.participants, newParticipant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(state.participants.filter(p => p.id !== id));
  };

  return {
    setCurrentUser,
    addParticipant,
    removeParticipant
  };
};
