"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ActivityDialog from '@/components/admin/ActivityDialog';
import { MOCK_ACTIVITIES } from '@/lib/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

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
  subcategory?: string;
  region?: string;
  amenities?: string[];
}

export default function ActivityManagementPage() {
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadActivities = () => {
      try {
        const savedActivities = localStorage.getItem('activities');
        const initialActivities = savedActivities
          ? JSON.parse(savedActivities)
          : MOCK_ACTIVITIES.map(a => ({
            ...a,
            id: a.id.toString(),
            status: 'active',
            category: { name: a.category || '' },
            location: { city: a.city || '' },
            city: a.city || '',
            price_from: a.priceFrom || 0,
            rating: a.rating || 0,
            subcategory: a.subcategory || '',
            region: a.region || '',
            amenities: 'amenities' in a ? (a as any).amenities || [] : []
          }));

        setActivityList(initialActivities);
        updatePublicActivities(initialActivities);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load activities",
        });
        setActivityList([]);
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, []);

  const updatePublicActivities = (activities: Activity[]) => {
    const publicActivities = activities.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      city: a.city,
      priceFrom: a.price_from,
      category: a.category?.name || '',
      subcategory: a.subcategory || '',
      region: a.region || '',
      duration: a.duration,
      groupSize: a.groupSize,
      image: a.image,
      rating: a.rating || 0,
      amenities: a.amenities || []
    }));
    localStorage.setItem('publicActivities', JSON.stringify(publicActivities));
  };

  const handleAddActivity = (newActivity: any) => {
    const activityToAdd = {
      ...newActivity,
      id: Math.random().toString(36).substr(2, 9),
      status: 'active',
      price_from: parseFloat(newActivity.priceFrom) || 0,
      category: { name: newActivity.category || '' },
      location: { city: newActivity.city || '' },
      city: newActivity.city || '',
      rating: parseFloat(newActivity.rating) || 0,
      subcategory: newActivity.subcategory || '',
      region: newActivity.region || '',
      amenities: newActivity.amenities || []
    };

    const updatedActivities = [...activityList, activityToAdd];
    setActivityList(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
    updatePublicActivities(updatedActivities);
    setIsDialogOpen(false);
    toast({ title: "Success", description: "Activity added successfully" });
  };

  const handleEditActivity = (updatedActivity: any) => {
    const updatedActivities = activityList.map(activity =>
      activity.id === updatedActivity.id ? {
        ...updatedActivity,
        status: activity.status,
        price_from: parseFloat(updatedActivity.priceFrom) || 0,
        category: { name: updatedActivity.category || '' },
        location: { city: updatedActivity.city || '' },
        city: updatedActivity.city || '',
        rating: parseFloat(updatedActivity.rating) || 0,
        subcategory: updatedActivity.subcategory || '',
        region: updatedActivity.region || '',
        amenities: updatedActivity.amenities || []
      } : activity
    );

    setActivityList(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
    updatePublicActivities(updatedActivities);
    setIsDialogOpen(false);
    toast({ title: "Success", description: "Activity updated successfully" });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    const updatedActivities = activityList.filter(a => a.id !== id);
    setActivityList(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
    updatePublicActivities(updatedActivities);
    toast({ title: "Success", description: "Activity deleted successfully" });
  };

  const handleStartEdit = (activity: Activity) => {
    setEditingActivity({
      ...activity,
      category: { name: activity.category?.name || '' },
      subcategory: activity.subcategory || '',
      region: activity.region || '',
      amenities: activity.amenities || []
    });
    setIsDialogOpen(true);
  };

  const toggleExpandActivity = (id: string) => {
    setExpandedActivity(expandedActivity === id ? null : id);
  };

  const filteredActivities = activityList.filter(a =>
    (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.city && a.city.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (categoryFilter === 'all' || a.category?.name === categoryFilter)
  );

  const uniqueCategories = Array.from(
    new Set(
      activityList
        .filter(a => a.category && a.category.name)
        .map(a => a.category.name)
    )
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full md:w-40" />
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full md:w-64" />
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Activity Management</h1>
        <Button
          onClick={() => {
            setEditingActivity(null);
            setIsDialogOpen(true);
          }}
          className="w-full md:w-auto bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Activity
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select 
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isMobileView ? (
        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <Card key={activity.id} className="relative overflow-hidden transition-shadow hover:shadow-md">
                <CardHeader 
                  className="pb-2 cursor-pointer" 
                  onClick={() => toggleExpandActivity(activity.id)}
                >
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg line-clamp-1">
                      {activity.title}
                    </CardTitle>
                    {expandedActivity === activity.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant={activity.status === 'active' ? 'default' : 'destructive'}>
                      {activity.status}
                    </Badge>
                    <span className="font-medium">£{activity.price_from.toFixed(2)}</span>
                  </div>
                </CardHeader>
                {expandedActivity === activity.id && (
                  <CardContent className="pt-0 border-t">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium">{activity.category?.name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{activity.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{activity.duration || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Group Size</p>
                        <p className="font-medium">{activity.groupSize || '-'}</p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(activity);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-500 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(activity.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="h-40 flex flex-col items-center justify-center gap-2">
                <Search className="h-8 w-8 text-gray-400" />
                <p className="text-muted-foreground">No activities found</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="whitespace-nowrap">Price (from)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map(activity => (
                      <TableRow key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="line-clamp-1">{activity.title}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{activity.title}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          {activity.category?.name || '-'}
                        </TableCell>
                        <TableCell>
                          {activity.city}
                        </TableCell>
                        <TableCell>
                          £{activity.price_from.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={activity.status === 'active' ? 'default' : 'destructive'}>
                            {activity.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEdit(activity)}
                              className="text-primary hover:bg-primary/10"
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-500/10"
                              onClick={() => handleDelete(activity.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 py-8">
                          <Search className="h-8 w-8 text-gray-400" />
                          <p className="text-muted-foreground">No activities found</p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSearchQuery('');
                              setCategoryFilter('all');
                            }}
                          >
                            Clear filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

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