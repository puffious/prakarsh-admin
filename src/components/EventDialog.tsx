import { useState, useEffect } from 'react';
import { Event, EventFormData } from '@/types/event';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
  onSave: (data: EventFormData) => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

const emptyFormData: EventFormData = {
  name: '',
  tagline: null,
  description: null,
  organizer: null,
  date: '',
  time: '',
  category: null,
  misc: null,
  location: null,
  rules: null,
  highlights: null,
  solo: null,
};

export function EventDialog({
  open,
  onOpenChange,
  event,
  onSave,
  onDelete,
  isAdmin = false,
}: EventDialogProps) {
  const [formData, setFormData] = useState<EventFormData>(emptyFormData);
  const isEditing = !!event;

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        tagline: event.tagline,
        description: event.description,
        organizer: event.organizer,
        date: event.date,
        time: event.time,
        category: event.category,
        misc: event.misc,
        location: event.location,
        rules: event.rules,
        highlights: event.highlights,
        solo: event.solo,
      });
    } else {
      setFormData(emptyFormData);
    }
  }, [event, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isAdmin ? (isEditing ? 'Edit Event' : 'Add Event') : 'Event Details'}
          </DialogTitle>
        </DialogHeader>

        {isAdmin ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer</Label>
              <Input
                id="organizer"
                value={formData.organizer || ''}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value || null })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="solo"
                checked={formData.solo || false}
                onCheckedChange={(checked) => setFormData({ ...formData, solo: checked as boolean })}
              />
              <Label htmlFor="solo" className="cursor-pointer">
                Solo Event
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="misc">Misc</Label>
              <Textarea
                id="misc"
                value={formData.misc || ''}
                onChange={(e) => setFormData({ ...formData, misc: e.target.value || null })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlights">Highlights</Label>
              <Textarea
                id="highlights"
                value={formData.highlights || ''}
                onChange={(e) => setFormData({ ...formData, highlights: e.target.value || null })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rules">Rules</Label>
              <Textarea
                id="rules"
                value={formData.rules || ''}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value || null })}
                rows={3}
              />
            </div>

            <div className="flex justify-between pt-4">
              {isEditing && onDelete && (
                <Button type="button" variant="destructive" onClick={onDelete}>
                  Delete
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
          <div className="space-y-4">
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
                    <p>{event.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p>{event.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p>{event.time}</p>
                  </div>
                </div>
                {event.location && (
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p>{event.location}</p>
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
                    <p>{event.category}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Solo Event</p>
                  <p>{event.solo ? 'Yes' : 'No'}</p>
                </div>
                {event.misc && (
                  <div>
                    <p className="text-sm text-muted-foreground">Misc</p>
                    <p>{event.misc}</p>
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
      </DialogContent>
    </Dialog>
  );
}
