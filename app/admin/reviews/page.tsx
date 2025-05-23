"use client";

import { useEffect, useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Search, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { reviews } from '@/lib/admin-api';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ReviewManagementPage() {
  const [reviewList, setReviewList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
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
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await reviews.getAll();
      setReviewList(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch reviews",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      if (newStatus === 'approved') {
        await reviews.approve(reviewId);
      } else if (newStatus === 'rejected') {
        await reviews.delete(reviewId);
      }
      fetchReviews();
      toast({
        title: "Success",
        description: "Review status updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update review status",
      });
    }
  };

  const toggleExpandReview = (id: string) => {
    setExpandedReview(expandedReview === id ? null : id);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  };

  const filteredReviews = reviewList.filter((review: any) =>
    review.activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (review.user?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    review.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Review Management</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isMobileView ? (
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review: any) => (
              <Card key={review.id} className="relative">
                <CardHeader 
                  className="pb-2 cursor-pointer" 
                  onClick={() => toggleExpandReview(review.id)}
                >
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg truncate">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{review.activity.title}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{review.activity.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    {expandedReview === review.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className={
                      review.status === 'approved' ? 'bg-green-100 text-green-800' :
                        review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                    }>
                      {review.status}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1">{review.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                {expandedReview === review.id && (
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">User</p>
                        <p>{review.user ? review.user.name : <span className="text-gray-400 italic">Unknown</span>}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p>{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground">Review</p>
                      <p className="line-clamp-3">{review.content}</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(review.id, 'approved');
                        }}
                        className="text-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(review.id, 'rejected');
                        }}
                        className="text-red-600"
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReview(review);
                        }}
                      >
                        <AlertCircle className="h-4 w-4 mr-1" /> Details
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="h-24 flex items-center justify-center">
                <p className="text-muted-foreground">No reviews found</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[800px] md:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Activity</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="min-w-[200px]">Review</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review: any) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="line-clamp-1">{review.activity.title}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{review.activity.title}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        {review.user ? review.user.name : <span className="text-gray-400 italic">Unknown</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1">{review.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="line-clamp-2">{review.content}</p>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px]">
                              <p>{review.content}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          review.status === 'approved' ? 'bg-green-100 text-green-800' :
                            review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                        }>
                          {review.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(review.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(review.id, 'approved')}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Approve review</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(review.id, 'rejected')}
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Reject review</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedReview(review)}
                              >
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-md lg:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Activity</h3>
                <p>{selectedReview.activity.title}</p>
              </div>
              <div>
                <h3 className="font-semibold">User</h3>
                <p>{selectedReview.user ? selectedReview.user.name : <span className="text-gray-400 italic">Unknown User</span>}</p>
              </div>
              <div>
                <h3 className="font-semibold">Rating</h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < selectedReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Review Content</h3>
                <p className="whitespace-pre-line">{selectedReview.content}</p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                <Badge variant="outline" className={
                  selectedReview.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedReview.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                }>
                  {selectedReview.status}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold">Date</h3>
                <p>{new Date(selectedReview.created_at).toLocaleString()}</p>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  variant="default" 
                  onClick={() => handleStatusChange(selectedReview.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Approve
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleStatusChange(selectedReview.id, 'rejected')}
                >
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
                <Button variant="outline" onClick={() => setSelectedReview(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}