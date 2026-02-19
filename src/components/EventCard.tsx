import { EventWithDays } from '@/types/event';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, UserCheck, Trophy } from 'lucide-react';

interface EventCardProps {
  event: EventWithDays;
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
          <div className="flex gap-2 shrink-0">
            {event.solo && (
              <Badge variant="outline" className="shrink-0">
                <UserCheck className="h-3 w-3 mr-1" />
                Solo
              </Badge>
            )}
            {event.category && (
              <Badge variant="secondary" className="shrink-0">
                {event.category}
              </Badge>
            )}
          </div>
        </div>
        {event.tagline && (
          <p className="text-sm text-muted-foreground">{event.tagline}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Day 1 Info */}
        {event.day1 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">Day 1</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.day1.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              {event.day1.start_time && (
                <>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{event.day1.start_time}</span>
                </>
              )}
            </div>
            {event.day1.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.day1.location}</span>
              </div>
            )}
          </div>
        )}

        {/* Day 2 Info */}
        {event.day2 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">Day 2</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.day2.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              {event.day2.start_time && (
                <>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{event.day2.start_time}</span>
                </>
              )}
            </div>
            {event.day2.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.day2.location}</span>
              </div>
            )}
          </div>
        )}

        {/* Show organizer if available */}
        {event.organizer && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{event.organizer}</span>
          </div>
        )}

        {/* Show prize pool if available */}
        {event.prize_pool > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>₹{event.prize_pool.toLocaleString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
