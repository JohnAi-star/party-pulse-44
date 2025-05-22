"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  dietary_requirements: string;
  plus_ones: number;
  notes: string;
}

interface GuestListProps {
  partyPlanId: string;
}

export default function GuestList({ partyPlanId }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await fetch(`/api/guest-lists?partyPlanId=${partyPlanId}`);
      const data = await response.json();
      setGuests(data);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch guest list",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const guestData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      dietary_requirements: formData.get('dietary_requirements'),
      plus_ones: parseInt(formData.get('plus_ones') as string) || 0,
      notes: formData.get('notes'),
    };

    try {
      if (editingGuest) {
        const response = await fetch('/api/guest-lists', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingGuest.id,
            updates: guestData,
          }),
        });

        if (!response.ok) throw new Error('Failed to update guest');

        toast({
          title: "Success",
          description: "Guest updated successfully",
        });
      } else {
        const response = await fetch('/api/guest-lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partyPlanId,
            guests: [guestData],
          }),
        });

        if (!response.ok) throw new Error('Failed to add guest');

        toast({
          title: "Success",
          description: "Guest added successfully",
        });
      }

      fetchGuests();
      setEditingGuest(null);
    } catch (error) {
      console.error('Error saving guest:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save guest",
      });
    }
  };

  const handleDelete = async (guestId: string) => {
    if (!confirm('Are you sure you want to remove this guest?')) return;

    try {
      const response = await fetch('/api/guest-lists', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: guestId }),
      });

      if (!response.ok) throw new Error('Failed to delete guest');

      toast({
        title: "Success",
        description: "Guest removed successfully",
      });

      fetchGuests();
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove guest",
      });
    }
  };

  if (loading) {
    return <div>Loading guest list...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Guest List</h3>
          <p className="text-sm text-muted-foreground">
            Manage your event attendees
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGuest ? 'Edit Guest' : 'Add New Guest'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingGuest?.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingGuest?.email}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={editingGuest?.phone}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietary_requirements">
                  Dietary Requirements
                </Label>
                <Textarea
                  id="dietary_requirements"
                  name="dietary_requirements"
                  defaultValue={editingGuest?.dietary_requirements}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plus_ones">Plus Ones</Label>
                <Input
                  id="plus_ones"
                  name="plus_ones"
                  type="number"
                  min="0"
                  defaultValue={editingGuest?.plus_ones || 0}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={editingGuest?.notes}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="submit">
                  {editingGuest ? 'Update Guest' : 'Add Guest'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dietary Requirements</TableHead>
              <TableHead>Plus Ones</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{guest.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {guest.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={guest.status === 'confirmed' ? 'default' : 'secondary'}
                  >
                    {guest.status}
                  </Badge>
                </TableCell>
                <TableCell>{guest.dietary_requirements}</TableCell>
                <TableCell>{guest.plus_ones}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingGuest(guest)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(guest.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {guests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No guests added yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}