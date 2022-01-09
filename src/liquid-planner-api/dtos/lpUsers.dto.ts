export interface LpUserDto {
  access_level: string;
  access_rights: {
    prioritize: boolean;
  };
  avatar_url: string;
  company: string;
  default_activity_id: number | null;
  email: string;
  first_name: string;
  is_virtual: boolean;
  last_name: string;
  created_at: string;
  last_access: string;
  daily_availability: number[];
  overdrive_scheduling: boolean;
  external_reference: string | number | null;
  timezone: string;
  user_name: string;
  team_name: string;
  type: string;
  id: number;
}
