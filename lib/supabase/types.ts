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
          role: "admin" | "user" | "premium"
          subscription_tier: string
          api_usage_limit: number
          api_usage_current: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "admin" | "user" | "premium"
          subscription_tier?: string
          api_usage_limit?: number
          api_usage_current?: number
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "admin" | "user" | "premium"
          subscription_tier?: string
          api_usage_limit?: number
          api_usage_current?: number
        }
      }
      ai_integrations: {
        Row: {
          id: string
          user_id: string
          name: string
          provider: string
          model_name: string
          api_key_encrypted: string
          api_endpoint: string | null
          configuration: Json
          status: "active" | "inactive" | "error"
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          provider: string
          model_name: string
          api_key_encrypted: string
          api_endpoint?: string | null
          configuration?: Json
          status?: "active" | "inactive" | "error"
        }
        Update: {
          name?: string
          provider?: string
          model_name?: string
          api_key_encrypted?: string
          api_endpoint?: string | null
          configuration?: Json
          status?: "active" | "inactive" | "error"
        }
      }
      prompts: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          content: string
          variables: Json
          tags: string[]
          category: string | null
          is_public: boolean
          is_template: boolean
          version: number
          parent_id: string | null
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
          variables?: Json
          tags?: string[]
          category?: string | null
          is_public?: boolean
          is_template?: boolean
          version?: number
          parent_id?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          content?: string
          variables?: Json
          tags?: string[]
          category?: string | null
          is_public?: boolean
          is_template?: boolean
          version?: number
          parent_id?: string | null
        }
      }
      workflows: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          nodes: Json
          edges: Json
          configuration: Json
          status: "draft" | "active" | "paused" | "archived"
          is_public: boolean
          version: number
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          description?: string | null
          nodes?: Json
          edges?: Json
          configuration?: Json
          status?: "draft" | "active" | "paused" | "archived"
          is_public?: boolean
          version?: number
          parent_id?: string | null
        }
        Update: {
          name?: string
          description?: string | null
          nodes?: Json
          edges?: Json
          configuration?: Json
          status?: "draft" | "active" | "paused" | "archived"
          is_public?: boolean
          version?: number
          parent_id?: string | null
        }
      }
      workflow_executions: {
        Row: {
          id: string
          workflow_id: string
          user_id: string
          status: "pending" | "running" | "completed" | "failed" | "cancelled"
          input_data: Json
          output_data: Json
          execution_log: Json
          error_message: string | null
          started_at: string | null
          completed_at: string | null
          duration_ms: number | null
          cost: number
          created_at: string
        }
        Insert: {
          workflow_id: string
          user_id: string
          status?: "pending" | "running" | "completed" | "failed" | "cancelled"
          input_data?: Json
          output_data?: Json
          execution_log?: Json
          error_message?: string | null
          started_at?: string | null
          completed_at?: string | null
          duration_ms?: number | null
          cost?: number
        }
        Update: {
          status?: "pending" | "running" | "completed" | "failed" | "cancelled"
          input_data?: Json
          output_data?: Json
          execution_log?: Json
          error_message?: string | null
          started_at?: string | null
          completed_at?: string | null
          duration_ms?: number | null
          cost?: number
        }
      }
      templates: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          name: string
          description: string | null
          category: string | null
          variables: Json
          default_values: Json
          is_public: boolean
          price: number
          usage_count: number
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          prompt_id: string
          name: string
          description?: string | null
          category?: string | null
          variables?: Json
          default_values?: Json
          is_public?: boolean
          price?: number
        }
        Update: {
          name?: string
          description?: string | null
          category?: string | null
          variables?: Json
          default_values?: Json
          is_public?: boolean
          price?: number
        }
      }
      marketplace_listings: {
        Row: {
          id: string
          user_id: string
          item_type: string
          item_id: string
          title: string
          description: string | null
          category: string | null
          tags: string[]
          price: number
          is_featured: boolean
          downloads: number
          rating: number
          rating_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          item_type: string
          item_id: string
          title: string
          description?: string | null
          category?: string | null
          tags?: string[]
          price?: number
          is_featured?: boolean
        }
        Update: {
          title?: string
          description?: string | null
          category?: string | null
          tags?: string[]
          price?: number
          is_featured?: boolean
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
        Update: {
          activity_type?: string
          activity_data?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
