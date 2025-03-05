export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      location_responses: {
        Row: {
          created_at: string | null
          id: string
          location_id: string | null
          note: string | null
          responder_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id?: string | null
          note?: string | null
          responder_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string | null
          note?: string | null
          responder_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_responses_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          meeting_id: string | null
          name: string
          suggested_by: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          meeting_id?: string | null
          name: string
          suggested_by: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          meeting_id?: string | null
          name?: string
          suggested_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string | null
          creator_initial: string
          creator_name: string
          id: string
          notes: string | null
          selected_location_id: string | null
          selected_time_slot_id: string | null
          status: Database["public"]["Enums"]["meeting_status"] | null
        }
        Insert: {
          created_at?: string | null
          creator_initial: string
          creator_name: string
          id?: string
          notes?: string | null
          selected_location_id?: string | null
          selected_time_slot_id?: string | null
          status?: Database["public"]["Enums"]["meeting_status"] | null
        }
        Update: {
          created_at?: string | null
          creator_initial?: string
          creator_name?: string
          id?: string
          notes?: string | null
          selected_location_id?: string | null
          selected_time_slot_id?: string | null
          status?: Database["public"]["Enums"]["meeting_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_selected_location"
            columns: ["selected_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_selected_time_slot"
            columns: ["selected_time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          created_at: string | null
          id: string
          initial: string
          meeting_id: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          initial: string
          meeting_id?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          initial?: string
          meeting_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      time_responses: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          responder_name: string
          start_time: string
          time_slot_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          responder_name: string
          start_time: string
          time_slot_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          responder_name?: string
          start_time?: string
          time_slot_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_responses_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      time_slots: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          id: string
          meeting_id: string | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          meeting_id?: string | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          meeting_id?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      meeting_status: "draft" | "pending" | "confirmed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
