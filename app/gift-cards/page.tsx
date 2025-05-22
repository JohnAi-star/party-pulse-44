import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Gift, CreditCard, Mail } from 'lucide-react';

export default function GiftCardsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Gift Cards</h1>
        <p className="text-xl text-muted-foreground">
          Give the gift of unforgettable experiences
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Gift Card Purchase Form */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase a Gift Card</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">£</span>
                    <Input
                      id="amount"
                      type="number"
                      min="10"
                      placeholder="50"
                      className="pl-7"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="recipientName">Recipient's Name</Label>
                  <Input
                    id="recipientName"
                    placeholder="Enter recipient's name"
                  />
                </div>

                <div>
                  <Label htmlFor="recipientEmail">Recipient's Email</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="Enter recipient's email"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Personal Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a personal message..."
                    rows={4}
                  />
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                Purchase Gift Card
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Gift Card Information */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">How it Works</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Gift className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Choose Amount</h4>
                    <p className="text-muted-foreground">
                      Select any amount from £10 to £500
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Instant Delivery</h4>
                    <p className="text-muted-foreground">
                      Gift card is sent immediately via email
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CreditCard className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Easy to Redeem</h4>
                    <p className="text-muted-foreground">
                      Can be used for any activity on our platform
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Valid for 12 months from purchase date</li>
                <li>• Can be used across multiple bookings</li>
                <li>• Non-refundable once purchased</li>
                <li>• Can be used in combination with other payment methods</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}