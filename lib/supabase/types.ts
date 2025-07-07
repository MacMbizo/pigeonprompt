export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: "user" | "admin" | "moderator"
          subscription_tier: string
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "user" | "admin" | "moderator"
          subscription_tier?: string
          credits?: number
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          role?: "user" | "admin" | "moderator"
          subscription_tier?: string
          credits?: number
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          website: string | null
          location: string | null
          social_links: Json
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          bio?: string | null
          website?: string | null
          location?: string | null
          social_links?: Json
          preferences?: Json
        }
        Update: {
          bio?: string | null
          website?: string | null
          location?: string | null
          social_links?: Json
          preferences?: Json
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
        }
        Update: {
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
        }
      }
      prompts: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          content: string
          category_id: string | null
          tags: string[]
          is_public: boolean
          is_featured: boolean
          version: number
          parent_id: string | null
          metadata: Json
          usage_count: number
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          description?: string | null
          content: string
          category_id?: string | null
          tags?: string[]
          is_public?: boolean
          is_featured?: boolean
          version?: number
          parent_id?: string | null
          metadata?: Json
        }
        Update: {
          title?: string
          description?: string | null
          content?: string
          category_id?: string | null
          tags?: string[]
          is_public?: boolean
          is_featured?: boolean
          version?: number
          metadata?: Json
        }
      }
      templates: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          category_id: string | null
          template_data: Json
          variables: Json
          is_public: boolean
          is_premium: boolean
          price: number
          downloads: number
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          description?: string | null
          category_id?: string | null
          template_data: Json
          variables?: Json
          is_public?: boolean
          is_premium?: boolean
          price?: number
        }
        Update: {
          name?: string
          description?: string | null
          category_id?: string | null
          template_data?: Json
          variables?: Json
          is_public?: boolean
          is_premium?: boolean
          price?: number
        }
      }
      ai_integrations: {
        Row: {
          id: string
          user_id: string
          name: string
          provider: string
          model: string
          api_key_encrypted: string | null
          configuration: Json
          status: "active" | "inactive" | "error"
          usage_count: number
          last_used: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          provider: string
          model: string
          api_key_encrypted?: string | null
          configuration?: Json
          status?: "active" | "inactive" | "error"
        }
        Update: {
          name?: string
          provider?: string
          model?: string
          api_key_encrypted?: string | null
          configuration?: Json
          status?: "active" | "inactive" | "error"
        }
      }
      workflows: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          workflow_data: Json
          status: "draft" | "active" | "paused" | "archived"
          is_public: boolean
          execution_count: number
          last_executed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          description?: string | null
          workflow_data: Json
          status?: "draft" | "active" | "paused" | "archived"
          is_public?: boolean
        }
        Update: {
          name?: string
          description?: string | null
          workflow_data?: Json
          status?: "draft" | "active" | "paused" | "archived"
          is_public?: boolean
        }
      }
      workflow_executions: {
        Row: {
          id: string
          workflow_id: string
          user_id: string
          status: "pending" | "running" | "completed" | "failed" | "cancelled"
          input_data: Json | null
          output_data: Json | null
          error_message: string | null
          execution_log: Json
          started_at: string
          completed_at: string | null
          duration_ms: number | null
        }
        Insert: {
          workflow_id: string
          user_id: string
          status?: "pending" | "running" | "completed" | "failed" | "cancelled"
          input_data?: Json | null
          output_data?: Json | null
          error_message?: string | null
          execution_log?: Json
        }
        Update: {
          status?: "pending" | "running" | "completed" | "failed" | "cancelled"
          output_data?: Json | null
          error_message?: string | null
          execution_log?: Json
          completed_at?: string | null
          duration_ms?: number | null
        }
      }
      marketplace_listings: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          type: string
          item_id: string
          price: number
          status: "draft" | "pending" | "approved" | "rejected"
          downloads: number
          rating: number
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          description?: string | null
          type: string
          item_id: string
          price?: number
          status?: "draft" | "pending" | "approved" | "rejected"
          tags?: string[]
        }
        Update: {
          title?: string
          description?: string | null
          price?: number
          status?: "draft" | "pending" | "approved" | "rejected"
          tags?: string[]
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          activity_data: Json
          created_at: string
        }
        Insert: {
          user_id: string
          activity_type: string
          activity_data?: Json
        }
        Update: never
      }
      collaborations: {
        Row: {
          id: string
          owner_id: string
          collaborator_id: string
          resource_type: string
          resource_id: string
          permission_level: string
          created_at: string
        }
        Insert: {
          owner_id: string
          collaborator_id: string
          resource_type: string
          resource_id: string
          permission_level?: string
        }
        Update: {
          permission_level?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_user_activity: {
        Args: {
          p_user_id: string
          p_activity_type: string
          p_activity_data?: Json
        }
        Returns: void
      }
    }
    Enums: {
      user_role: "user" | "admin" | "moderator"
      workflow_status: "draft" | "active" | "paused" | "archived"
      execution_status: "pending" | "running" | "completed" | "failed" | "cancelled"
      integration_status: "active" | "inactive" | "error"
      marketplace_status: "draft" | "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
