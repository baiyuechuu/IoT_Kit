// This file can be auto-generated using: supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
// For now, we'll use a basic setup that you can extend

export interface Database {
	public: {
		Tables: {
			// User profiles table
			profiles: {
				Row: {
					id: string;
					email: string;
					display_name: string | null;
					avatar_url: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					email: string;
					display_name?: string | null;
					avatar_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					display_name?: string | null;
					avatar_url?: string | null;
					updated_at?: string;
				};
			};
			// Dashboard configurations table
			dashboards: {
				Row: {
					id: string;
					user_id: string;
					name: string;
					widgets: any; // JSON array of widget configurations
					layout_config: any | null; // Additional layout settings
					is_public: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					name: string;
					widgets: any;
					layout_config?: any | null;
					is_public?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					widgets?: any;
					layout_config?: any | null;
					is_public?: boolean;
					updated_at?: string;
				};
			};
			// IoT devices table
			devices: {
				Row: {
					id: string;
					user_id: string;
					name: string;
					device_type: string;
					status: 'online' | 'offline' | 'warning';
					last_seen: string | null;
					metadata: any | null; // Device-specific data
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					name: string;
					device_type: string;
					status?: 'online' | 'offline' | 'warning';
					last_seen?: string | null;
					metadata?: any | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					device_type?: string;
					status?: 'online' | 'offline' | 'warning';
					last_seen?: string | null;
					metadata?: any | null;
					updated_at?: string;
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
			device_status: 'online' | 'offline' | 'warning';
		};
	};
}
