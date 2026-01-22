import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Event, EventFormData } from '@/types/event';
import { useAuth } from '@/hooks/useAuth';
import { EventCard } from '@/components/EventCard';
import { EventDialog } from '@/components/EventDialog';
import { Button } from '@/components/ui/button';
import { Plus, LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function Index() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return data as Event[];
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

  const handleEventClick = (event: Event) => {
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

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-14 px-4">
          <h1 className="font-semibold">Events</h1>
          <div className="flex items-center gap-2">
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
        {isLoading ? (
          <div className="text-center text-muted-foreground py-12">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No events found.
            {user && (
              <p className="mt-2">
                <Button variant="link" onClick={handleAddClick}>
                  Add your first event
                </Button>
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
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
        onDelete={handleDelete}
        isAdmin={!!user}
      />
    </div>
  );
}
