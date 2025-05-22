import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface GroupBookingFormProps {
  activityId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function GroupBookingForm({ activityId, onSubmit, onCancel }: GroupBookingFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    groupSize: '',
    date: null as Date | null,
    specialRequirements: '',
    paymentType: 'group', // 'group' or 'individual'
    participantDetails: [] as { name: string; email: string }[],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participantDetails: [...prev.participantDetails, { name: '', email: '' }]
    }));
  };

  const updateParticipant = (index: number, field: 'name' | 'email', value: string) => {
    const newParticipants = [...formData.participantDetails];
    newParticipants[index][field] = value;
    setFormData(prev => ({ ...prev, participantDetails: newParticipants }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.groupSize) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      await onSubmit(formData);
      toast({
        title: "Success",
        description: "Group booking request submitted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit group booking request",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Group Booking Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organizer Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organizer Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizerName">Name</Label>
                <Input
                  id="organizerName"
                  value={formData.organizerName}
                  onChange={(e) => handleInputChange('organizerName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizerEmail">Email</Label>
                <Input
                  id="organizerEmail"
                  type="email"
                  value={formData.organizerEmail}
                  onChange={(e) => handleInputChange('organizerEmail', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizerPhone">Phone Number</Label>
              <Input
                id="organizerPhone"
                type="tel"
                value={formData.organizerPhone}
                onChange={(e) => handleInputChange('organizerPhone', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groupSize">Group Size</Label>
                <Select
                  value={formData.groupSize}
                  onValueChange={(value) => handleInputChange('groupSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 15, 20, 25, 30].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} people
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <DatePicker
                  date={formData.date}
                  onChange={(date) => handleInputChange('date', date)}
                />
              </div>
            </div>
          </div>

          {/* Payment Type */}
          <div className="space-y-2">
            <Label>Payment Type</Label>
            <Select
              value={formData.paymentType}
              onValueChange={(value) => handleInputChange('paymentType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="group">Group Payment</SelectItem>
                <SelectItem value="individual">Individual Payments</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Special Requirements */}
          <div className="space-y-2">
            <Label htmlFor="specialRequirements">Special Requirements</Label>
            <Textarea
              id="specialRequirements"
              value={formData.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
              placeholder="Any dietary requirements, accessibility needs, or special requests?"
            />
          </div>

          {/* Participant Details (shown only for individual payments) */}
          {formData.paymentType === 'individual' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Participant Details</h3>
              {formData.participantDetails.map((participant, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Participant Name"
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Participant Email"
                    value={participant.email}
                    onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addParticipant}>
                Add Participant
              </Button>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600">
              Submit Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}