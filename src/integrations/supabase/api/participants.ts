
// src/integrations/supabase/api/participants.ts
import { supabase } from '../client';
import type { User } from '@/types';
import { ParticipantInsert } from './types';

// Add participants to a meeting
export async function addParticipants(participants: ParticipantInsert[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('participants')
      .insert(participants);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding participants:', error);
    return false;
  }
}

// Get participants by meeting ID
export async function getParticipantsByMeetingId(meetingId: string): Promise<User[] | null> {
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('meeting_id', meetingId);

    if (error) throw error;
    
    return data.map(p => ({
      id: p.id,
      name: p.name,
      initial: p.initial
    }));
  } catch (error) {
    console.error('Error getting participants:', error);
    return null;
  }
}
