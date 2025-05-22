"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'completed';
}

interface ChecklistProps {
  partyPlanId: string;
}

export default function Checklist({ partyPlanId }: ChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchChecklist();
  }, []);

  const fetchChecklist = async () => {
    try {
      const response = await fetch(`/api/checklists?partyPlanId=${partyPlanId}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching checklist:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch checklist",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const itemData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      due_date: formData.get('due_date') as string,
      status: 'pending' as const,
    };

    try {
      if (editingItem) {
        const response = await fetch('/api/checklists', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            updates: itemData,
          }),
        });

        if (!response.ok) throw new Error('Failed to update checklist item');

        toast({
          title: "Success",
          description: "Checklist item updated successfully",
        });
      } else {
        const response = await fetch('/api/checklists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partyPlanId,
            item: itemData,
          }),
        });

        if (!response.ok) throw new Error('Failed to add checklist item');

        toast({
          title: "Success",
          description: "Checklist item added successfully",
        });
      }

      fetchChecklist();
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving checklist item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save checklist item",
      });
    }
  };

  const handleToggleStatus = async (itemId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/checklists', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: itemId,
          updates: {
            status: completed ? 'completed' : 'pending',
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      fetchChecklist();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return;

    try {
      const response = await fetch('/api/checklists', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId }),
      });

      if (!response.ok) throw new Error('Failed to delete checklist item');

      toast({
        title: "Success",
        description: "Checklist item removed successfully",
      });

      fetchChecklist();
    } catch (error) {
      console.error('Error deleting checklist item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove checklist item",
      });
    }
  };

  if (loading) {
    return <div>Loading checklist...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Planning Checklist</h3>
          <p className="text-sm text-muted-foreground">
            Track your party planning tasks
          </p>
        </div>

        <Button onClick={() => setEditingItem(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {(editingItem || items.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Task' : 'Add New Task'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingItem?.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  name="due_date"
                  type="date"
                  defaultValue={editingItem?.due_date}
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update Task' : 'Add Task'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className={item.status === 'completed' ? 'opacity-60' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={item.status === 'completed'}
                  onCheckedChange={(checked) =>
                    handleToggleStatus(item.id, checked as boolean)
                  }
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {new Date(item.due_date).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}