import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';
import { partyPlanning } from '@/lib/api-client';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  status: string;
}

interface TimelineProps {
  partyPlanId: string;
}

export default function Timeline({ partyPlanId }: TimelineProps) {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const data = await partyPlanning.getTimeline(partyPlanId);
      setItems(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch timeline",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await partyPlanning.createTimeline({
        partyPlanId,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        startTime: new Date(formData.get('startTime') as string).toISOString(),
        endTime: formData.get('endTime') ? 
          new Date(formData.get('endTime') as string).toISOString() : 
          undefined
      });

      fetchTimeline();
      (e.target as HTMLFormElement).reset();
      
      toast({
        title: "Success",
        description: "Timeline item added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add timeline item",
      });
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await partyPlanning.updateTimelineItem(id, { status });
      fetchTimeline();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
    }
  };

  if (loading) {
    return <div>Loading timeline...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Timeline Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <DatePicker
                  date={null}
                  onChange={(date) => {}}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time (Optional)</Label>
                <DatePicker
                  date={null}
                  onChange={(date) => {}}
                />
              </div>
            </div>

            <Button type="submit">Add Item</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
                <Button
                  variant={item.status === 'completed' ? 'ghost' : 'outline'}
                  onClick={() => handleStatusUpdate(
                    item.id,
                    item.status === 'completed' ? 'pending' : 'completed'
                  )}
                >
                  {item.status === 'completed' ? 'Completed' : 'Mark Complete'}
                </Button>
              </div>

              <div className="flex gap-4 text-sm text-muted-foreground">
                <div>
                  Start: {new Date(item.start_time).toLocaleString()}
                </div>
                {item.end_time && (
                  <div>
                    End: {new Date(item.end_time).toLocaleString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {items.length === 0 && (
          <p className="text-center text-muted-foreground">
            No timeline items added yet
          </p>
        )}
      </div>
    </div>
  );
}