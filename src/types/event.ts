export interface Event {
  id: number;
  name: string;
  tagline: string | null;
  description: string | null;
  organizer: string | null;
  category: string | null;
  prize_pool: number;
  keywords: string[] | null;
  solo: boolean;
  registration_pitch: string | null;
  rules: string | null;
  highlights: string | null;
}

export interface Day1 {
  id?: number;
  event_id: number;
  location: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
}

export interface Day2 {
  id?: number;
  event_id: number;
  location: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
}

export interface EventWithDays extends Event {
  day1?: Day1 | null;
  day2?: Day2 | null;
}

export type EventFormData = Omit<Event, 'id'>;
export type Day1FormData = Omit<Day1, 'id' | 'event_id'>;
export type Day2FormData = Omit<Day2, 'id' | 'event_id'>;
