
// src/context/meeting/storage/supabaseStorage.ts
import { Meeting } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Load meeting data from Supabase
export const loadMeetingFromSupabase = async (id: string): Promise<Meeting | null> => {
  try {
    // Try to get from Supabase if it's a valid UUID
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();
      
    if (data && !error) {
      console.log(`Loaded meeting data for ID: ${id} from Supabase`);
      // Transform Supabase data to Meeting type with the correct status type
      return {
        id: data.id,
        creator: {
          id: `creator-${data.id}`,
          name: data.creator_name,
          initial: data.creator_initial
        },
        timeSlots: [], // You would load these from related tables
        participants: [],
        status: data.status as 'draft' | 'pending' | 'confirmed'
      } as Meeting;
    }
    
    return null;
  } catch (error) {
    console.log("Error loading from Supabase:", error);
    return null;
  }
};
