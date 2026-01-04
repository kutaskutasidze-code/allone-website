export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string | null;
          category: string;
          technologies: string[];
          display_order: number;
          is_published: boolean;
          revenue: number;
          contract_url: string | null;
          invoice_url: string | null;
          project_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image_url?: string | null;
          category: string;
          technologies?: string[];
          display_order?: number;
          is_published?: boolean;
          revenue?: number;
          contract_url?: string | null;
          invoice_url?: string | null;
          project_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image_url?: string | null;
          category?: string;
          technologies?: string[];
          display_order?: number;
          is_published?: boolean;
          revenue?: number;
          contract_url?: string | null;
          invoice_url?: string | null;
          project_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          features: string[];
          display_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon: string;
          features?: string[];
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon?: string;
          features?: string[];
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          logo_text: string;
          logo_url: string | null;
          display_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_text: string;
          logo_url?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_text?: string;
          logo_url?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      stats: {
        Row: {
          id: string;
          value: string;
          label: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          value: string;
          label: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          value?: string;
          label?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      company_values: {
        Row: {
          id: string;
          number: string;
          title: string;
          description: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          title: string;
          description: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          title?: string;
          description?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_info: {
        Row: {
          id: string;
          email: string;
          location: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          location: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          location?: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      about_content: {
        Row: {
          id: string;
          hero_subtitle: string;
          hero_title: string;
          story_subtitle: string;
          story_title: string;
          story_paragraphs: string[];
          values_subtitle: string;
          values_title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hero_subtitle?: string;
          hero_title: string;
          story_subtitle?: string;
          story_title: string;
          story_paragraphs?: string[];
          values_subtitle?: string;
          values_title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hero_subtitle?: string;
          hero_title?: string;
          story_subtitle?: string;
          story_title?: string;
          story_paragraphs?: string[];
          values_subtitle?: string;
          values_title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          display_order?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier usage
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

export type Client = Database['public']['Tables']['clients']['Row'];
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export type Stat = Database['public']['Tables']['stats']['Row'];
export type StatInsert = Database['public']['Tables']['stats']['Insert'];
export type StatUpdate = Database['public']['Tables']['stats']['Update'];

export type CompanyValue = Database['public']['Tables']['company_values']['Row'];
export type CompanyValueInsert = Database['public']['Tables']['company_values']['Insert'];
export type CompanyValueUpdate = Database['public']['Tables']['company_values']['Update'];

export type ContactInfo = Database['public']['Tables']['contact_info']['Row'];
export type ContactInfoInsert = Database['public']['Tables']['contact_info']['Insert'];
export type ContactInfoUpdate = Database['public']['Tables']['contact_info']['Update'];

export type AboutContent = Database['public']['Tables']['about_content']['Row'];
export type AboutContentInsert = Database['public']['Tables']['about_content']['Insert'];
export type AboutContentUpdate = Database['public']['Tables']['about_content']['Update'];

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];
