import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EventWithDays, EventFormData, Day1FormData, Day2FormData } from '@/types/event';
import { useAuth } from '@/hooks/useAuth';
import { EventCard } from '@/components/EventCard';
import { EventDialog } from '@/components/EventDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, LogIn, LogOut, Search } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['all', 'tech', 'non-tech', 'esports', 'workshops'] as const;

export default function Index() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<EventWithDays | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('id', { ascending: true });

      if (eventsError) throw eventsError;

      // Fetch day1 data
      const { data: day1Data, error: day1Error } = await supabase
        .from('day1')
        .select('*');

      if (day1Error) throw day1Error;

      // Fetch day2 data
      const { data: day2Data, error: day2Error } = await supabase
        .from('day2')
        .select('*');

      if (day2Error) throw day2Error;

      // Combine data
      const eventsWithDays: EventWithDays[] = eventsData.map((event) => ({
        ...event,
        day1: day1Data.find((d) => d.event_id === event.id) || null,
        day2: day2Data.find((d) => d.event_id === event.id) || null,
      }));

      return eventsWithDays;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const { error } = await supabase.from('events').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created');
      setDialogOpen(false);
    },
    onError: () => toast.error('Failed to create event'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EventFormData }) => {
      const { error } = await supabase.from('events').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated');
      setDialogOpen(false);
    },
    onError: () => toast.error('Failed to update event'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted');
      setDialogOpen(false);
    },
    onError: () => toast.error('Failed to delete event'),
  });

  // Day 1 mutations
  const createDay1Mutation = useMutation({
    mutationFn: async ({ eventId, data }: { eventId: number; data: Day1FormData }) => {
      const { error } = await supabase.from('day1').insert([{ ...data, event_id: eventId }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Day 1 details created');
    },
    onError: () => toast.error('Failed to create Day 1 details'),
  });

  const updateDay1Mutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Day1FormData }) => {
      const { error } = await supabase.from('day1').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Day 1 details updated');
    },
    onError: () => toast.error('Failed to update Day 1 details'),
  });

  const deleteDay1Mutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('day1').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Day 1 details deleted');
    },
    onError: () => toast.error('Failed to delete Day 1 details'),
  });

  // Day 2 mutations
  const createDay2Mutation = useMutation({
    mutationFn: async ({ eventId, data }: { eventId: number; data: Day2FormData }) => {
      const { error } = await supabase.from('day2').insert([{ ...data, event_id: eventId }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Day 2 details created');
    },
    onError: () => toast.error('Failed to create Day 2 details'),
  });

  const updateDay2Mutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Day2FormData }) => {
      const { error } = await supabase.from('day2').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Day 2 details updated');
    },
    onError: () => toast.error('Failed to update Day 2 details'),
  });

  const deleteDay2Mutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('day2').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Day 2 details deleted');
    },
    onError: () => toast.error('Failed to delete Day 2 details'),
  });

  const handleEventClick = (event: EventWithDays) => {
    setSelectedEvent(event);
    setIsCreating(false);
    setDialogOpen(true);
  };

  const handleAddClick = () => {
    setSelectedEvent(null);
    setIsCreating(true);
    setDialogOpen(true);
  };

  const handleSave = (data: EventFormData) => {
    if (isCreating) {
      createMutation.mutate(data);
    } else if (selectedEvent) {
      updateMutation.mutate({ id: selectedEvent.id, data });
    }
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteMutation.mutate(selectedEvent.id);
    }
  };

  const handleSaveDay1 = (data: Day1FormData) => {
    if (selectedEvent) {
      if (selectedEvent.day1?.id) {
        updateDay1Mutation.mutate({ id: selectedEvent.day1.id, data });
      } else {
        createDay1Mutation.mutate({ eventId: selectedEvent.id, data });
      }
    }
  };

  const handleDeleteDay1 = () => {
    if (selectedEvent?.day1?.id) {
      deleteDay1Mutation.mutate(selectedEvent.day1.id);
    }
  };

  const handleSaveDay2 = (data: Day2FormData) => {
    if (selectedEvent) {
      if (selectedEvent.day2?.id) {
        updateDay2Mutation.mutate({ id: selectedEvent.day2.id, data });
      } else {
        createDay2Mutation.mutate({ eventId: selectedEvent.id, data });
      }
    }
  };

  const handleDeleteDay2 = () => {
    if (selectedEvent?.day2?.id) {
      deleteDay2Mutation.mutate(selectedEvent.day2.id);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out');
  };

  // Filter events based on search query and selected category
  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchQuery === '' || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      event.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-14 px-4 gap-4">
          <h1 className="font-semibold shrink-0">Events</h1>
          
          {/* Search Bar in Navbar */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-16 text-center"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
              {filteredEvents.length}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <Button size="sm" onClick={handleAddClick}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-1" />
                  Admin Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        {/* Category Buttons */}
        <div className="flex justify-center gap-2 flex-wrap mb-6">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-12">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            {events.length === 0 ? (
              <>
                No events found.
                {user && (
                  <p className="mt-2">
                    <Button variant="link" onClick={handleAddClick}>
                      Add your first event
                    </Button>
                  </p>
                )}
              </>
            ) : (
              'No events match your search criteria.'
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        )}
      </main>

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={isCreating ? null : selectedEvent}
        onSave={handleSave}
        onSaveDay1={handleSaveDay1}
        onSaveDay2={handleSaveDay2}
        onDelete={handleDelete}
        onDeleteDay1={handleDeleteDay1}
        onDeleteDay2={handleDeleteDay2}
        isAdmin={!!user}
      />
    </div>
  );
}
