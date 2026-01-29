import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Event, EventFormData } from '@/types/event';
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
        onDelete={handleDelete}
        isAdmin={!!user}
      />
    </div>
  );
}
