"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ActivityDialog from '@/components/admin/ActivityDialog';
import { MOCK_ACTIVITIES } from '@/lib/constants';

interface Activity {
  id: string;
  title: string;
  description: string;
  price_from: number;
  status: string;
  category: { name: string };
  location: { city: string };
  city: string;
  duration: string;
  groupSize: string;
  image: string;
  rating: number;
}

export default function ActivityManagementPage() {
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadActivities = () => {
      try {
        const savedActivities = localStorage.getItem('activities');
        const initialActivities = savedActivities 
          ? JSON.parse(savedActivities) 
          : MOCK_ACTIVITIES.map(a => ({
              ...a,
              status: 'active',
              category: { name: a.category },
              location: { city: a.city },
              city: a.city,
              price_from: a.priceFrom || 0
            }));

        setActivityList(initialActivities);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load activities",
        });
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, []);

  const handleAddActivity = (newActivity: any) => {
    const activityToAdd = {
      ...newActivity,
      id: Math.random().toString(36).substr(2, 9),
      status: 'active',
      price_from: parseFloat(newActivity.priceFrom),
      category: { name: newActivity.category },
      location: { city: newActivity.city },
      city: newActivity.city
    };

    const updatedActivities = [...activityList, activityToAdd];
    updateActivities(updatedActivities);
    toast({ title: "Success", description: "Activity added successfully" });
  };

  const handleEditActivity = (updatedActivity: any) => {
    const updatedActivities = activityList.map(activity => 
      activity.id === updatedActivity.id ? {
        ...updatedActivity,
        status: 'active',
        price_from: parseFloat(updatedActivity.priceFrom),
        category: { name: updatedActivity.category },
        location: { city: updatedActivity.city },
        city: updatedActivity.city
      } : activity
    );
    
    updateActivities(updatedActivities);
    toast({ title: "Success", description: "Activity updated successfully" });
  };

  const updateActivities = (activities: Activity[]) => {
    setActivityList(activities);
    localStorage.setItem('activities', JSON.stringify(activities));
    localStorage.setItem('publicActivities', JSON.stringify(activities.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      city: a.city,
      priceFrom: a.price_from,
      category: a.category && a.category.name ? a.category.name : '',
      duration: a.duration,
      groupSize: a.groupSize,
      image: a.image,
      rating: a.rating
    }))));
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    
    const updatedActivities = activityList.filter(a => a.id !== id);
    updateActivities(updatedActivities);
    toast({ title: "Success", description: "Activity deleted successfully" });
  };

  const handleStartEdit = (activity: Activity) => {
    setEditingActivity({
      ...activity,
      price_from: activity.price_from,
      category: { name: activity.category?.name ?? '' }
    });
    setIsDialogOpen(true);
  };

  const filteredActivities = activityList.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Activity Management</h1>
        <Button 
          onClick={() => {
            setEditingActivity(null);
            setIsDialogOpen(true);
          }} 
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Activity
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.from(
                  new Set(
                    activityList
                      .filter(a => a.category && a.category.name)
                      .map(a => a.category.name)
                  )
                ).map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map(activity => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.title}</TableCell>
                    <TableCell>{activity.category?.name ?? ''}</TableCell>
                    <TableCell>{activity.city}</TableCell>
                    <TableCell>£{activity.price_from.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={activity.status === 'active' ? 'default' : 'destructive'}>
                        {activity.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartEdit(activity)}
                        className="hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No activities found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ActivityDialog
        isOpen={isDialogOpen}
        onCloseAction={() => {
          setIsDialogOpen(false);
          setEditingActivity(null);
        }}
        onSubmitAction={editingActivity ? handleEditActivity : handleAddActivity}
        initialData={editingActivity}
      />
    </div>
  );
}