
// src/integrations/supabase/api/types.ts
// Type definitions for Supabase tables

export type MeetingInsert = {
  creator_name: string;
  creator_initial: string;
  status?: 'draft' | 'pending' | 'confirmed';
  notes?: string;
};

export type ParticipantInsert = {
  meeting_id: string;
  name: string;
  initial: string;
};

export type TimeSlotInsert = {
  meeting_id: string;
  date: string;
  start_time: string;
  end_time: string;
};

export type TimeResponseInsert = {
  time_slot_id: string;
  responder_name: string;
  start_time: string;
  end_time: string;
};

export type LocationInsert = {
  meeting_id: string;
  name: string;
  description?: string;
  suggested_by: string;
};

export type LocationResponseInsert = {
  location_id: string;
  responder_name: string;
  note?: string;
};
