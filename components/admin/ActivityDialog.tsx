"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CITIES, CATEGORIES } from '@/lib/constants';

interface ActivityDialogProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onSubmitAction: (activity: any) => void;
  initialData?: any;
}

export default function ActivityDialog({
  isOpen,
  onCloseAction,
  onSubmitAction,
  initialData
}: ActivityDialogProps) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    city: '',
    category: '',
    priceFrom: '',
    duration: '',
    groupSize: '',
    image: '',
    rating: 5,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        title: initialData.title || '',
        description: initialData.description || '',
        city: initialData.city || initialData.location?.city || '',
        category: initialData.category?.name || initialData.category || '',
        priceFrom: initialData.priceFrom || initialData.price_from?.toString() || '',
        duration: initialData.duration || '',
        groupSize: initialData.groupSize || '',
        image: initialData.image || '',
        rating: initialData.rating || 5,
      });
    } else {
      setFormData({
        id: '',
        title: '',
        description: '',
        city: '',
        category: '',
        priceFrom: '',
        duration: '',
        groupSize: '',
        image: '',
        rating: 5,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const activityData = {
      ...formData,
      id: formData.id || Math.random().toString(36).substr(2, 9),
      priceFrom: formData.priceFrom,
      rating: Number(formData.rating),
    };

    onSubmitAction(activityData);
    onCloseAction();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select
                value={formData.city}
                onValueChange={(value) => setFormData({ ...formData, city: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent className="h-48 overflow-y-auto">
                  {CITIES.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="h-48 overflow-y-auto">
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.title}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceFrom">Price From (£) *</Label>
              <Input
                id="priceFrom"
                type="number"
                min="0"
                step="0.01"
                value={formData.priceFrom}
                onChange={(e) => setFormData({ ...formData, priceFrom: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 2 hours"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="groupSize">Group Size *</Label>
              <Input
                id="groupSize"
                value={formData.groupSize}
                onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                placeholder="e.g., 4-8 people"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCloseAction}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? 'Update' : 'Add'} Activity</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}