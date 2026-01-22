import { Event } from '@/types/event';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:border-foreground/20"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{event.name}</CardTitle>
          {event.category && (
            <Badge variant="secondary" className="shrink-0">
              {event.category}
            </Badge>
          )}
        </div>
        {event.tagline && (
          <p className="text-sm text-muted-foreground">{event.tagline}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
          <Clock className="h-4 w-4 ml-2" />
          <span>{event.time}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        )}
        {event.organizer && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{event.organizer}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
