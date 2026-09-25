// Hand-written to match migration_files/000{1,2,3}_*.sql.
// Once the project is linked, prefer regenerating this file with:
//   supabase gen types typescript --linked > packages/supabase/src/types.ts
// and re-adding the `Functions` block below if the CLI omits it.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProductCategory = "hair" | "personal" | "nails" | "wigs";

export interface Database {
  public: {
    Tables: {
      staff_roles: {
        Row: {
          id: string;
          label: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          label: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      staff_profiles: {
        Row: {
          id: string;
          name: string;
          role_id: string;
          job_title: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role_id?: string;
          job_title?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role_id?: string;
          job_title?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      customer_profiles: {
        Row: {
          id: string;
          auth_user_id: string | null;
          name: string;
          phone: string;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          name: string;
          phone: string;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          name?: string;
          phone?: string;
          email?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          brand: string | null;
          category: ProductCategory;
          price: number;
          stock_units: number;
          is_hidden: boolean;
          is_bestseller: boolean;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          brand?: string | null;
          category: ProductCategory;
          price: number;
          stock_units?: number;
          is_hidden?: boolean;
          is_bestseller?: boolean;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          brand?: string | null;
          category?: ProductCategory;
          price?: number;
          stock_units?: number;
          is_hidden?: boolean;
          is_bestseller?: boolean;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          name: string;
          price: number;
          duration_label: string;
          description: string | null;
          status: "draft" | "published";
          category: "Hair" | "Bridal" | "Lashes" | "Nails";
          icon: string | null;
          image_url: string | null;
          duration_mins: number;
          object_position: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          price: number;
          duration_label: string;
          description?: string | null;
          status?: "draft" | "published";
          category?: "Hair" | "Bridal" | "Lashes" | "Nails";
          icon?: string | null;
          image_url?: string | null;
          duration_mins?: number;
          object_position?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          price?: number;
          duration_label?: string;
          description?: string | null;
          status?: "draft" | "published";
          category?: "Hair" | "Bridal" | "Lashes" | "Nails";
          icon?: string | null;
          image_url?: string | null;
          duration_mins?: number;
          object_position?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          ref: string;
          customer_id: string | null;
          phone: string;
          order_date: string;
          fulfilment_type: "delivery" | "pickup";
          fulfilment_detail: string | null;
          address: string | null;
          payment_status: "paid" | "pending" | "cancelled";
          delivery_status:
            | "processing"
            | "packed"
            | "out_for_delivery"
            | "delivered"
            | "ready_for_pickup"
            | "picked_up";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ref?: string;
          customer_id?: string | null;
          phone: string;
          order_date?: string;
          fulfilment_type: "delivery" | "pickup";
          fulfilment_detail?: string | null;
          address?: string | null;
          payment_status?: "paid" | "pending" | "cancelled";
          delivery_status?:
            | "processing"
            | "packed"
            | "out_for_delivery"
            | "delivered"
            | "ready_for_pickup"
            | "picked_up";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ref?: string;
          customer_id?: string | null;
          phone?: string;
          order_date?: string;
          fulfilment_type?: "delivery" | "pickup";
          fulfilment_detail?: string | null;
          address?: string | null;
          payment_status?: "paid" | "pending" | "cancelled";
          delivery_status?:
            | "processing"
            | "packed"
            | "out_for_delivery"
            | "delivered"
            | "ready_for_pickup"
            | "picked_up";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          ref: string;
          customer_id: string | null;
          phone: string;
          service_id: string;
          scheduled_at: string;
          location_type: "studio" | "home_service";
          location_detail: string | null;
          status: "requested" | "accepted" | "completed" | "declined";
          deposit_amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ref?: string;
          customer_id?: string | null;
          phone: string;
          service_id: string;
          scheduled_at: string;
          location_type: "studio" | "home_service";
          location_detail?: string | null;
          status?: "requested" | "accepted" | "completed" | "declined";
          deposit_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ref?: string;
          customer_id?: string | null;
          phone?: string;
          service_id?: string;
          scheduled_at?: string;
          location_type?: "studio" | "home_service";
          location_detail?: string | null;
          status?: "requested" | "accepted" | "completed" | "declined";
          deposit_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      programmes: {
        Row: {
          id: string;
          name: string;
          price_label: string;
          description: string | null;
          status: "draft" | "published";
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price_label: string;
          description?: string | null;
          status?: "draft" | "published";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price_label?: string;
          description?: string | null;
          status?: "draft" | "published";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      programme_slots: {
        Row: {
          id: string;
          programme_id: string;
          slot_time: "10 AM" | "12 PM" | "2 PM" | "4 PM" | "6 PM";
          is_available: boolean;
        };
        Insert: {
          id?: string;
          programme_id: string;
          slot_time: "10 AM" | "12 PM" | "2 PM" | "4 PM" | "6 PM";
          is_available?: boolean;
        };
        Update: {
          id?: string;
          programme_id?: string;
          slot_time?: "10 AM" | "12 PM" | "2 PM" | "4 PM" | "6 PM";
          is_available?: boolean;
        };
        Relationships: [];
      };
      tickets: {
        Row: {
          id: string;
          ref: string;
          customer_id: string | null;
          name: string;
          phone: string;
          email: string | null;
          tier: "ga" | "vip";
          source: string | null;
          event_date: string;
          status: "reserved" | "paid" | "cancelled";
          created_at: string;
        };
        Insert: {
          id?: string;
          ref?: string;
          customer_id?: string | null;
          name: string;
          phone: string;
          email?: string | null;
          tier: "ga" | "vip";
          source?: string | null;
          event_date: string;
          status?: "reserved" | "paid" | "cancelled";
          created_at?: string;
        };
        Update: {
          id?: string;
          ref?: string;
          customer_id?: string | null;
          name?: string;
          phone?: string;
          email?: string | null;
          tier?: "ga" | "vip";
          source?: string | null;
          event_date?: string;
          status?: "reserved" | "paid" | "cancelled";
          created_at?: string;
        };
        Relationships: [];
      };
      sponsors: {
        Row: {
          id: string;
          brand: string;
          tier: string;
          contact_name: string;
          email: string | null;
          status: "new" | "contacted" | "confirmed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand: string;
          tier: string;
          contact_name: string;
          email?: string | null;
          status?: "new" | "contacted" | "confirmed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand?: string;
          tier?: string;
          contact_name?: string;
          email?: string | null;
          status?: "new" | "contacted" | "confirmed";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          quote: string;
          customer_name: string;
          service_label: string | null;
          photo_url: string | null;
          status: "draft" | "published";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote: string;
          customer_name: string;
          service_label?: string | null;
          photo_url?: string | null;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quote?: string;
          customer_name?: string;
          service_label?: string | null;
          photo_url?: string | null;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          status: "draft" | "published";
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          status?: "draft" | "published";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          status?: "draft" | "published";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      journal_posts: {
        Row: {
          id: string;
          category: "Hair care" | "Bridal" | "Nail care" | "Personal care";
          title: string;
          body: string;
          published_at: string;
          status: "draft" | "published";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category: "Hair care" | "Bridal" | "Nail care" | "Personal care";
          title: string;
          body: string;
          published_at?: string;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category?: "Hair care" | "Bridal" | "Nail care" | "Personal care";
          title?: string;
          body?: string;
          published_at?: string;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          staff_id: string | null;
          name: string;
          title: string;
          initials: string;
          accent_color: string;
          photo_url: string | null;
          status: "draft" | "published";
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          staff_id?: string | null;
          name: string;
          title: string;
          initials: string;
          accent_color: string;
          photo_url?: string | null;
          status?: "draft" | "published";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          staff_id?: string | null;
          name?: string;
          title?: string;
          initials?: string;
          accent_color?: string;
          photo_url?: string | null;
          status?: "draft" | "published";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      about_stats: {
        Row: {
          id: string;
          figure: string;
          title: string;
          description: string;
          chip: string | null;
          count_from: number | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          figure: string;
          title: string;
          description: string;
          chip?: string | null;
          count_from?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          figure?: string;
          title?: string;
          description?: string;
          chip?: string | null;
          count_from?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: boolean;
          delivery_fee: number;
          low_stock_threshold: number;
          show_exhibition_teaser: boolean;
          whatsapp_number: string;
          instagram_handle: string;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          delivery_fee?: number;
          low_stock_threshold?: number;
          show_exhibition_teaser?: boolean;
          whatsapp_number?: string;
          instagram_handle?: string;
          updated_at?: string;
        };
        Update: {
          id?: boolean;
          delivery_fee?: number;
          low_stock_threshold?: number;
          show_exhibition_teaser?: boolean;
          whatsapp_number?: string;
          instagram_handle?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_staff: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_owner: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      create_guest_order: {
        Args: {
          p_name: string;
          p_phone: string;
          p_email: string | null;
          p_fulfilment_type: string;
          p_fulfilment_detail: string | null;
          p_address: string | null;
          p_items: Json;
        };
        Returns: Database["public"]["Tables"]["orders"]["Row"];
      };
      create_guest_booking: {
        Args: {
          p_name: string;
          p_phone: string;
          p_email: string | null;
          p_service_id: string;
          p_scheduled_at: string;
          p_location_type: string;
          p_location_detail: string | null;
          p_notes: string | null;
        };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
    };
    Enums: {
      product_category: ProductCategory;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
