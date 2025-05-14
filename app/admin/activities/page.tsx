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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Activity {
  id: string;
  title: string;
  description: string;
  price_from: number;
  status?: string; // Made optional to handle cases where it might not exist
  category?: { name: string } | null;
  location?: { city: string } | null;
}

export default function ActivityManagementPage() {
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await activities.getAll();
      console.log('Fetched activities:', data); // Debug log
      
      if (!data || data.length === 0) {
        toast({
          title: "Info",
          description: "No activities found",
        });
        return;
      }

      setActivityList(data.map(activity => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        price_from: activity.price_from,
        status: activity.status || 'active',
        category: activity.category ? { name: activity.category.name } : undefined,
        location: activity.location ? { city: activity.location.city } : undefined
      })));
      
    } catch (error: any) {
      console.error('Error fetching activities:', error); // Detailed error log
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

  // ... (keep your existing handleCreate, handleEdit, handleDelete functions)

  const filteredActivities = activityList.filter(activity =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      await activities.delete(id);
      setActivityList((prev) => prev.filter((activity) => activity.id !== id));
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

  const handleEdit = (id: string, activity: Activity) => {
    // Open a dialog or navigate to an edit page with the activity details
    console.log(`Editing activity with ID: ${id}`, activity);
    toast({
      title: "Edit Activity",
      description: `Editing activity: ${activity.title}`,
    });
    // You can implement navigation or dialog logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header and Add Activity button (keep existing) */}

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
                {/* Add dynamic categories if needed */}
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
                    <TableCell>
                      {activity.category?.name || 'Uncategorized'}
                    </TableCell>
                    <TableCell>
                      {activity.location?.city || 'N/A'}
                    </TableCell>
                    <TableCell>£{activity.price_from.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={activity.status === 'active' ? 'default' : 'destructive'}
                        className={activity.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {activity.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(activity.id, activity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(activity.id)}
                        className="text-red-500 hover:text-red-700"
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
    </div>
  );
}