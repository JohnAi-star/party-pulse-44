"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';

interface Table {
  id: string;
  name: string;
  capacity: number;
  layout: {
    x: number;
    y: number;
    shape: 'round' | 'rectangular';
    width: number;
    height: number;
  };
}

interface TableAssignment {
  id: string;
  table_id: string;
  guest_id: string;
  seat_number: number;
}

interface TablePlannerProps {
  partyPlanId: string;
}

export default function TablePlanner({ partyPlanId }: TablePlannerProps) {
  const [tables, setTables] = useState<Table[]>([]);
  const [assignments, setAssignments] = useState<TableAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch(`/api/table-plans?partyPlanId=${partyPlanId}`);
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tables",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const tableData = {
      name: formData.get('name') as string,
      capacity: parseInt(formData.get('capacity') as string),
      layout: {
        x: 0,
        y: 0,
        shape: formData.get('shape') as 'round' | 'rectangular',
        width: parseInt(formData.get('width') as string),
        height: parseInt(formData.get('height') as string),
      },
    };

    try {
      if (editingTable) {
        const response = await fetch('/api/table-plans', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingTable.id,
            updates: tableData,
          }),
        });

        if (!response.ok) throw new Error('Failed to update table');

        toast({
          title: "Success",
          description: "Table updated successfully",
        });
      } else {
        const response = await fetch('/api/table-plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partyPlanId,
            table: tableData,
          }),
        });

        if (!response.ok) throw new Error('Failed to add table');

        toast({
          title: "Success",
          description: "Table added successfully",
        });
      }

      fetchTables();
      setEditingTable(null);
    } catch (error) {
      console.error('Error saving table:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save table",
      });
    }
  };

  const handleDelete = async (tableId: string) => {
    if (!confirm('Are you sure you want to remove this table?')) return;

    try {
      const response = await fetch('/api/table-plans', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tableId }),
      });

      if (!response.ok) throw new Error('Failed to delete table');

      toast({
        title: "Success",
        description: "Table removed successfully",
      });

      fetchTables();
    } catch (error) {
      console.error('Error deleting table:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove table",
      });
    }
  };

  if (loading) {
    return <div>Loading table plan...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Table Planning</h3>
          <p className="text-sm text-muted-foreground">
            Arrange tables and assign seating
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTable ? 'Edit Table' : 'Add New Table'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Table Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingTable?.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  defaultValue={editingTable?.capacity || 8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shape">Shape</Label>
                <select
                  id="shape"
                  name="shape"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={editingTable?.layout.shape || 'round'}
                >
                  <option value="round">Round</option>
                  <option value="rectangular">Rectangular</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    min="1"
                    defaultValue={editingTable?.layout.width || 100}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    min="1"
                    defaultValue={editingTable?.layout.height || 100}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="submit">
                  {editingTable ? 'Update Table' : 'Add Table'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <Card key={table.id}>
            <CardHeader>
              <CardTitle>{table.name}</CardTitle>
              <CardDescription>
                Capacity: {table.capacity} guests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>
                    {assignments.filter(a => a.table_id === table.id).length} /{' '}
                    {table.capacity} seated
                  </span>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingTable(table)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(table.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tables.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No tables added yet. Click "Add Table" to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}