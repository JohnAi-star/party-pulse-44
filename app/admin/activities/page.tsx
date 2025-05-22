"use client";

import { useEffect, useState } from 'react';
import { activities } from '@/lib/admin-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  status?: string;
  category?: { name: string } | null;
  location?: { city: string } | null;
}

// Helper function to normalize activity data
const normalizeActivity = (activity: any): Activity => {
  // Handle location
  let locationCity = 'N/A';
  if (activity.location) {
    if (typeof activity.location === 'string') {
      locationCity = activity.location;
    } else if (activity.location.city) {
      locationCity = activity.location.city;
    }
  } else if (activity.city) {
    locationCity = activity.city;
  }

  // Handle category
  let categoryName = null;
  if (activity.category) {
    categoryName = typeof activity.category === 'string' 
      ? { name: activity.category }
      : { name: activity.category?.name || 'Uncategorized' };
  }

  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    price_from: activity.priceFrom || activity.price_from || 0,
    status: activity.status || 'active',
    category: categoryName,
    location: { city: locationCity }
  };
};

export default function ActivityManagementPage() {
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      // Get activities from localStorage
      const localActivities = JSON.parse(localStorage.getItem('activities') || '[]');

      // Get activities from API
      let apiActivities = [];
      try {
        apiActivities = await activities.getAll();
      } catch (apiError) {
        console.log("Using mock data as fallback");
        apiActivities = MOCK_ACTIVITIES;
      }

      // Combine and deduplicate activities
      const combinedActivities = [...localActivities, ...apiActivities];
      const uniqueActivities = combinedActivities.reduce((acc: any[], current) => {
        const exists = acc.some(item => item.id === current.id);
        if (!exists) {
          return [...acc, current];
        }
        return acc;
      }, []);

      if (uniqueActivities.length === 0) {
        toast({
          title: "Info",
          description: "No activities found",
        });
        return;
      }

      // Normalize all activities
      const normalizedActivities = uniqueActivities.map(normalizeActivity);
      setActivityList(normalizedActivities);

      // Update localStorage with normalized data
      localStorage.setItem('activities', JSON.stringify(normalizedActivities));

    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch activities",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddActivity = (newActivity: any) => {
    try {
      // Normalize the new activity
      const normalizedActivity = normalizeActivity({
        ...newActivity,
        id: newActivity.id || Math.random().toString(36).substr(2, 9),
        status: 'active'
      });

      // Update localStorage
      const currentActivities = JSON.parse(localStorage.getItem('activities') || '[]');
      const updatedActivities = [...currentActivities, normalizedActivity];
      localStorage.setItem('activities', JSON.stringify(updatedActivities));

      // Update state
      setActivityList(prev => [...prev, normalizedActivity]);

      toast({
        title: "Success",
        description: "Activity added successfully",
      });
    } catch (error) {
      console.error("Error adding activity:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save activity",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      // Delete from localStorage
      const currentActivities = JSON.parse(localStorage.getItem('activities') || '[]');
      const updatedActivities = currentActivities.filter((activity: any) => activity.id !== id);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));

      // Try to delete from API if exists
      try {
        await activities.delete(id);
      } catch (apiError) {
        console.log("Activity not found in API, only removing from local storage");
      }

      // Update state
      setActivityList(prev => prev.filter(activity => activity.id !== id));

      toast({
        title: "Success",
        description: "Activity deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting activity:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete activity",
      });
    }
  };

  const handleEdit = async (id: string, updatedData: Partial<Activity>) => {
    try {
      // Update in localStorage
      const currentActivities = JSON.parse(localStorage.getItem('activities') || '[]');
      const updatedActivities = currentActivities.map((activity: any) =>
        activity.id === id ? normalizeActivity({ ...activity, ...updatedData }) : activity
      );
      localStorage.setItem('activities', JSON.stringify(updatedActivities));

      // Update state
      setActivityList(prev =>
        prev.map(activity =>
          activity.id === id ? normalizeActivity({ ...activity, ...updatedData }) : activity
        )
      );

      toast({
        title: "Success",
        description: "Activity updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update activity",
      });
    }
  };

  const filteredActivities = activityList.filter(activity =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (activity.location?.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Activity Management</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
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
                onChange={(e) => handleSearch(e.target.value)}
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
                      .map(activity => activity.category?.name)
                      .filter(Boolean)
                  )
                ).map(category => (
                  <SelectItem key={category} value={category || ''}>
                    {category}
                  </SelectItem>
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
                <TableHead className="w-[25%]">Title</TableHead>
                <TableHead className="w-[15%]">Category</TableHead>
                <TableHead className="w-[15%]">City</TableHead>
                <TableHead className="w-[15%]">Price</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="text-right w-[15%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.title}</TableCell>
                    <TableCell>{activity.category?.name || 'Uncategorized'}</TableCell>
                    <TableCell>{activity.location?.city || 'N/A'}</TableCell>
                    <TableCell>£{activity.price_from.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={activity.status === 'active' ? 'default' : 'destructive'}
                        className={activity.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'}
                      >
                        {activity.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newTitle = prompt("Enter new title", activity.title);
                          const newDesc = prompt("Enter new description", activity.description);
                          if (newTitle !== null || newDesc !== null) {
                            handleEdit(activity.id, {
                              title: newTitle || activity.title,
                              description: newDesc || activity.description
                            });
                          }
                        }}
                        className="hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(activity.id)}
                        className="hover:bg-gray-100 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {activityList.length === 0 ? 'No activities found' : 'No matching activities found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ActivityDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddActivity}
      />
    </div>
  );
}