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
      alerts: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      customization_settings: {
        Row: {
          accent_color: string
          bottom_gradient: string
          id: number
          negative_color: string
          platform_name: string
          positive_color: string
          primary_color: string
          secondary_color: string
          top_gradient: string
          updated_at: string | null
        }
        Insert: {
          accent_color?: string
          bottom_gradient?: string
          id?: number
          negative_color?: string
          platform_name?: string
          positive_color?: string
          primary_color?: string
          secondary_color?: string
          top_gradient?: string
          updated_at?: string | null
        }
        Update: {
          accent_color?: string
          bottom_gradient?: string
          id?: number
          negative_color?: string
          platform_name?: string
          positive_color?: string
          primary_color?: string
          secondary_color?: string
          top_gradient?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      evolution_webhook_events: {
        Row: {
          content: string | null
          created_at: string
          event_type: string
          id: string
          message_type: string | null
          raw_data: Json | null
          recipient_number: string | null
          sender_number: string | null
          status: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          event_type: string
          id?: string
          message_type?: string | null
          raw_data?: Json | null
          recipient_number?: string | null
          sender_number?: string | null
          status?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          event_type?: string
          id?: string
          message_type?: string | null
          raw_data?: Json | null
          recipient_number?: string | null
          sender_number?: string | null
          status?: string | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          current: number
          end_date: string
          id: string
          period: string
          start_date: string
          target: number
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current?: number
          end_date: string
          id?: string
          period: string
          start_date: string
          target: number
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          current?: number
          end_date?: string
          id?: string
          period?: string
          start_date?: string
          target?: number
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_transaction_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_transaction_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_transaction_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_transaction_id_fkey"
            columns: ["related_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      peace_fund_transactions: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          id: string
          peace_fund_id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          description: string
          id?: string
          peace_fund_id: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          id?: string
          peace_fund_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "peace_fund_transactions_peace_fund_id_fkey"
            columns: ["peace_fund_id"]
            isOneToOne: false
            referencedRelation: "peace_funds"
            referencedColumns: ["id"]
          },
        ]
      }
      peace_funds: {
        Row: {
          created_at: string
          current_amount: number
          id: string
          minimum_alert_amount: number | null
          target_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          id?: string
          minimum_alert_amount?: number | null
          target_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          id?: string
          minimum_alert_amount?: number | null
          target_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          profile_image_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          contact: string | null
          created_at: string
          date: string
          description: string
          id: string
          is_original: boolean | null
          is_recurrent: boolean | null
          parent_transaction_id: string | null
          payment_method: string
          recurrence_end_date: string | null
          recurrence_frequency: string | null
          recurrence_interval: number | null
          recurrence_start_date: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          contact?: string | null
          created_at?: string
          date?: string
          description: string
          id?: string
          is_original?: boolean | null
          is_recurrent?: boolean | null
          parent_transaction_id?: string | null
          payment_method: string
          recurrence_end_date?: string | null
          recurrence_frequency?: string | null
          recurrence_interval?: number | null
          recurrence_start_date?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          contact?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_original?: boolean | null
          is_recurrent?: boolean | null
          parent_transaction_id?: string | null
          payment_method?: string
          recurrence_end_date?: string | null
          recurrence_frequency?: string | null
          recurrence_interval?: number | null
          recurrence_start_date?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_parent_transaction_id_fkey"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_config: {
        Row: {
          api_token: string
          created_at: string
          id: string
          is_enabled: boolean
          notification_frequency: string
          recipient_numbers: string[]
          sender_number: string
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          api_token: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          notification_frequency?: string
          recipient_numbers: string[]
          sender_number: string
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          api_token?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          notification_frequency?: string
          recipient_numbers?: string[]
          sender_number?: string
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      whatsapp_logs: {
        Row: {
          error_message: string | null
          event_type: string
          id: string
          message: string
          recipient: string
          sent_at: string
          status: string
          user_id: string
        }
        Insert: {
          error_message?: string | null
          event_type: string
          id?: string
          message: string
          recipient: string
          sent_at?: string
          status: string
          user_id: string
        }
        Update: {
          error_message?: string | null
          event_type?: string
          id?: string
          message?: string
          recipient?: string
          sent_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_message_logs: {
        Row: {
          created_at: string
          id: string
          message: string
          number: string
          response: Json | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          number: string
          response?: Json | null
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          number?: string
          response?: Json | null
          status?: string
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          created_at: string
          event_type: string
          id: string
          message_template: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          message_template: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          message_template?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const
