import { useState, useEffect } from 'react';
import { EventWithDays, EventFormData, Day1FormData, Day2FormData } from '@/types/event';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { KeywordInput } from '@/components/KeywordInput';
import { Badge } from '@/components/ui/badge';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: EventWithDays | null;
  onSave: (data: EventFormData) => void;
  onSaveDay1: (data: Day1FormData) => void;
  onSaveDay2: (data: Day2FormData) => void;
  onDelete?: () => void;
  onDeleteDay1?: () => void;
  onDeleteDay2?: () => void;
  isAdmin?: boolean;
}

const emptyEventFormData: EventFormData = {
  name: '',
  tagline: null,
  description: null,
  organizer: null,
  category: null,
  prize_pool: 0,
  keywords: null,
  solo: true,
  registration_pitch: null,
  rules: null,
  highlights: null,
};

const emptyDay1FormData: Day1FormData = {
  location: null,
  date: '2026-02-25',
  start_time: null,
  end_time: null,
};

const emptyDay2FormData: Day2FormData = {
  location: null,
  date: '2026-02-26',
  start_time: null,
  end_time: null,
};

export function EventDialog({
  open,
  onOpenChange,
  event,
  onSave,
  onSaveDay1,
  onSaveDay2,
  onDelete,
  onDeleteDay1,
  onDeleteDay2,
  isAdmin = false,
}: EventDialogProps) {
  const [eventFormData, setEventFormData] = useState<EventFormData>(emptyEventFormData);
  const [day1FormData, setDay1FormData] = useState<Day1FormData>(emptyDay1FormData);
  const [day2FormData, setDay2FormData] = useState<Day2FormData>(emptyDay2FormData);
  const [activeTab, setActiveTab] = useState('details');
  const isEditing = !!event;

  useEffect(() => {
    if (event) {
      setEventFormData({
        name: event.name,
        tagline: event.tagline,
        description: event.description,
        organizer: event.organizer,
        category: event.category,
        prize_pool: event.prize_pool,
        keywords: event.keywords,
        solo: event.solo,
        registration_pitch: event.registration_pitch,
        rules: event.rules,
        highlights: event.highlights,
      });
      
      if (event.day1) {
        setDay1FormData({
          location: event.day1.location,
          date: event.day1.date,
          start_time: event.day1.start_time,
          end_time: event.day1.end_time,
        });
      } else {
        setDay1FormData(emptyDay1FormData);
      }
      
      if (event.day2) {
        setDay2FormData({
          location: event.day2.location,
          date: event.day2.date,
          start_time: event.day2.start_time,
          end_time: event.day2.end_time,
        });
      } else {
        setDay2FormData(emptyDay2FormData);
      }
    } else {
      setEventFormData(emptyEventFormData);
      setDay1FormData(emptyDay1FormData);
      setDay2FormData(emptyDay2FormData);
    }
    setActiveTab('details');
  }, [event, open]);

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(eventFormData);
  };

  const handleDay1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDay1(day1FormData);
  };

  const handleDay2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDay2(day2FormData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isAdmin ? (isEditing ? 'Edit Event' : 'Add Event') : 'Event Details'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col min-h-0">
          <div className="space-y-3 pb-3 shrink-0">
            <TabsList className="grid w-full grid-cols-1 h-12">
              <TabsTrigger value="details" className="text-base font-medium">Details</TabsTrigger>
            </TabsList>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('day1')}
                className={`h-12 px-4 rounded-md border-2 font-medium transition-all ${
                  activeTab === 'day1'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-input hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                Day 1
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('day2')}
                className={`h-12 px-4 rounded-md border-2 font-medium transition-all ${
                  activeTab === 'day2'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-input hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                Day 2
              </button>
            </div>
          </div>

          {/* Details Tab */}
          <TabsContent value="details" className="flex-1 min-h-0 overflow-y-auto mt-0 data-[state=inactive]:hidden">
            {isAdmin ? (
              <form onSubmit={handleEventSubmit} className="space-y-4 pb-4">
                <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={eventFormData.name}
                onChange={(e) => setEventFormData({ ...eventFormData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={eventFormData.tagline || ''}
                onChange={(e) => setEventFormData({ ...eventFormData, tagline: e.target.value || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={eventFormData.description || ''}
                onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value || null })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  value={eventFormData.organizer || ''}
                  onChange={(e) => setEventFormData({ ...eventFormData, organizer: e.target.value || null })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={eventFormData.category || ''}
                  onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value || null })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prize_pool">Prize Pool</Label>
              <Input
                id="prize_pool"
                type="number"
                value={eventFormData.prize_pool}
                onChange={(e) => setEventFormData({ ...eventFormData, prize_pool: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label>Keywords</Label>
              <KeywordInput
                keywords={eventFormData.keywords || []}
                onChange={(keywords) => setEventFormData({ ...eventFormData, keywords: keywords.length > 0 ? keywords : null })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="solo"
                checked={eventFormData.solo}
                onCheckedChange={(checked) => setEventFormData({ ...eventFormData, solo: checked as boolean })}
              />
              <Label htmlFor="solo" className="cursor-pointer">
                Solo Event
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_pitch">Registration Pitch</Label>
              <Textarea
                id="registration_pitch"
                value={eventFormData.registration_pitch || ''}
                onChange={(e) => setEventFormData({ ...eventFormData, registration_pitch: e.target.value || null })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlights">Highlights</Label>
              <Textarea
                id="highlights"
                value={eventFormData.highlights || ''}
                onChange={(e) => setEventFormData({ ...eventFormData, highlights: e.target.value || null })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rules">Rules</Label>
              <Textarea
                id="rules"
                value={eventFormData.rules || ''}
                onChange={(e) => setEventFormData({ ...eventFormData, rules: e.target.value || null })}
                rows={3}
              />
            </div>

            <div className="flex justify-between pt-4">
              {isEditing && onDelete && (
                <Button type="button" variant="destructive" onClick={onDelete}>
                  Delete Event
                </Button>
              )}
              <div className={`flex gap-2 ${!isEditing ? 'ml-auto' : ''}`}>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4 pb-4">
            {event && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{event.name}</p>
                </div>
                {event.tagline && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tagline</p>
                    <p>{event.tagline}</p>
                  </div>
                )}
                {event.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="whitespace-pre-wrap">{event.description}</p>
                  </div>
                )}
                {event.organizer && (
                  <div>
                    <p className="text-sm text-muted-foreground">Organizer</p>
                    <p>{event.organizer}</p>
                  </div>
                )}
                {event.category && (
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge variant="secondary">{event.category}</Badge>
                  </div>
                )}
                {event.prize_pool > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Prize Pool</p>
                    <p className="font-semibold">₹{event.prize_pool.toLocaleString()}</p>
                  </div>
                )}
                {event.keywords && event.keywords.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Keywords</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {event.keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p>{event.solo ? 'Solo Event' : 'Team Event'}</p>
                </div>
                {event.registration_pitch && (
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Pitch</p>
                    <p className="whitespace-pre-wrap">{event.registration_pitch}</p>
                  </div>
                )}
                {event.highlights && (
                  <div>
                    <p className="text-sm text-muted-foreground">Highlights</p>
                    <p className="whitespace-pre-wrap">{event.highlights}</p>
                  </div>
                )}
                {event.rules && (
                  <div>
                    <p className="text-sm text-muted-foreground">Rules</p>
                    <p className="whitespace-pre-wrap">{event.rules}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </TabsContent>

          {/* Day 1 Tab */}
          <TabsContent value="day1" className="flex-1 min-h-0 overflow-y-auto mt-0 data-[state=inactive]:hidden">
            {isAdmin ? (
              event?.day1 || isEditing ? (
                <form onSubmit={handleDay1Submit} className="space-y-4 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="day1-location">Location</Label>
                    <Input
                      id="day1-location"
                      value={day1FormData.location || ''}
                      onChange={(e) => setDay1FormData({ ...day1FormData, location: e.target.value || null })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="day1-date">Date</Label>
                    <Input
                      id="day1-date"
                      type="date"
                      value={day1FormData.date}
                      onChange={(e) => setDay1FormData({ ...day1FormData, date: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="day1-start">Start Time</Label>
                      <Input
                        id="day1-start"
                        type="time"
                        value={day1FormData.start_time || ''}
                        onChange={(e) => setDay1FormData({ ...day1FormData, start_time: e.target.value || null })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="day1-end">End Time</Label>
                      <Input
                        id="day1-end"
                        type="time"
                        value={day1FormData.end_time || ''}
                        onChange={(e) => setDay1FormData({ ...day1FormData, end_time: e.target.value || null })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    {event?.day1 && onDeleteDay1 && (
                      <Button type="button" variant="destructive" onClick={onDeleteDay1}>
                        Delete Day 1
                      </Button>
                    )}
                    <div className={`flex gap-2 ${!event?.day1 ? 'ml-auto' : ''}`}>
                      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">{event?.day1 ? 'Update' : 'Create'}</Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Create an event first to add Day 1 details</p>
                </div>
              )
            ) : (
              <div className="space-y-4 pb-4">
                {event?.day1 ? (
                  <>
                    {event.day1.location && (
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p>{event.day1.location}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{new Date(event.day1.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    {(event.day1.start_time || event.day1.end_time) && (
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p>
                          {event.day1.start_time && event.day1.start_time}
                          {event.day1.start_time && event.day1.end_time && ' - '}
                          {event.day1.end_time && event.day1.end_time}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No Day 1 details available</p>
                  </div>
                )}
              </div>
            )}
      </TabsContent>

          {/* Day 2 Tab */}
          <TabsContent value="day2" className="flex-1 min-h-0 overflow-y-auto mt-0 data-[state=inactive]:hidden">
            {isAdmin ? (
              event?.day2 || isEditing ? (
                <form onSubmit={handleDay2Submit} className="space-y-4 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="day2-location">Location</Label>
                    <Input
                      id="day2-location"
                      value={day2FormData.location || ''}
                      onChange={(e) => setDay2FormData({ ...day2FormData, location: e.target.value || null })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="day2-date">Date</Label>
                    <Input
                      id="day2-date"
                      type="date"
                      value={day2FormData.date}
                      onChange={(e) => setDay2FormData({ ...day2FormData, date: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="day2-start">Start Time</Label>
                      <Input
                        id="day2-start"
                        type="time"
                        value={day2FormData.start_time || ''}
                        onChange={(e) => setDay2FormData({ ...day2FormData, start_time: e.target.value || null })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="day2-end">End Time</Label>
                      <Input
                        id="day2-end"
                        type="time"
                        value={day2FormData.end_time || ''}
                        onChange={(e) => setDay2FormData({ ...day2FormData, end_time: e.target.value || null })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    {event?.day2 && onDeleteDay2 && (
                      <Button type="button" variant="destructive" onClick={onDeleteDay2}>
                        Delete Day 2
                      </Button>
                    )}
                    <div className={`flex gap-2 ${!event?.day2 ? 'ml-auto' : ''}`}>
                      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">{event?.day2 ? 'Update' : 'Create'}</Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Create an event first to add Day 2 details</p>
                </div>
              )
            ) : (
              <div className="space-y-4 pb-4">
                {event?.day2 ? (
                  <>
                    {event.day2.location && (
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p>{event.day2.location}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{new Date(event.day2.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    {(event.day2.start_time || event.day2.end_time) && (
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p>
                          {event.day2.start_time && event.day2.start_time}
                          {event.day2.start_time && event.day2.end_time && ' - '}
                          {event.day2.end_time && event.day2.end_time}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No Day 2 details available</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
