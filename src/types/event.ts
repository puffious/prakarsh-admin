export interface Event {
  id: number;
  name: string;
  tagline: string | null;
  description: string | null;
  organizer: string | null;
  date: string;
  time: string;
  category: string | null;
  misc: string | null;
  location: string | null;
  rules: string | null;
  highlights: string | null;
  solo: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export type EventFormData = Omit<Event, 'id' | 'created_at' | 'updated_at'>;
