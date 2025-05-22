"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  type: string;
  price_per_person: number;
  dietary_info: {
    vegetarian?: boolean;
    vegan?: boolean;
    gluten_free?: boolean;
    contains_nuts?: boolean;
  };
}

interface MenuPlannerProps {
  partyPlanId: string;
}

export default function MenuPlanner({ partyPlanId }: MenuPlannerProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`/api/menu-items?partyPlanId=${partyPlanId}`);
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch menu items",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const itemData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as string,
      price_per_person: parseFloat(formData.get('price') as string),
      dietary_info: {
        vegetarian: formData.get('vegetarian') === 'true',
        vegan: formData.get('vegan') === 'true',
        gluten_free: formData.get('gluten_free') === 'true',
        contains_nuts: formData.get('contains_nuts') === 'true',
      },
    };

    try {
      if (editingItem) {
        const response = await fetch('/api/menu-items', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            updates: itemData,
          }),
        });

        if (!response.ok) throw new Error('Failed to update menu item');

        toast({
          title: "Success",
          description: "Menu item updated successfully",
        });
      } else {
        const response = await fetch('/api/menu-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partyPlanId,
            item: itemData,
          }),
        });

        if (!response.ok) throw new Error('Failed to add menu item');

        toast({
          title: "Success",
          description: "Menu item added successfully",
        });
      }

      fetchMenuItems();
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save menu item",
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this menu item?')) return;

    try {
      const response = await fetch('/api/menu-items', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId }),
      });

      if (!response.ok) throw new Error('Failed to delete menu item');

      toast({
        title: "Success",
        description: "Menu item removed successfully",
      });

      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove menu item",
      });
    }
  };

  if (loading) {
    return <div>Loading menu items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Menu Planning</h3>
          <p className="text-sm text-muted-foreground">
            Plan your event menu and dietary options
          </p>
        </div>

        <Button onClick={() => setEditingItem(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  £{item.price_per_person} per person
                </p>
                <div className="space-x-2">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {(editingItem || menuItems.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  name="type"
                  defaultValue={editingItem?.type || 'main'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="main">Main Course</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                    <SelectItem value="drink">Drink</SelectItem>
                    <SelectItem value="canape">Canapé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Person (£)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingItem?.price_per_person}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Dietary Information</Label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="vegetarian"
                      defaultChecked={editingItem?.dietary_info.vegetarian}
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="vegan"
                      defaultChecked={editingItem?.dietary_info.vegan}
                    />
                    <span>Vegan</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="gluten_free"
                      defaultChecked={editingItem?.dietary_info.gluten_free}
                    />
                    <span>Gluten Free</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="contains_nuts"
                      defaultChecked={editingItem?.dietary_info.contains_nuts}
                    />
                    <span>Contains Nuts</span>
                  </label>
                </div>
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
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}