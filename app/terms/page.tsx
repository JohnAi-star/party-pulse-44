import { Card, CardContent } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 20, 2024</p>

        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                These Terms and Conditions govern your use of Party Pulse and the services we provide. By using our platform, you agree to these terms in full. If you disagree with any part of these terms, please do not use our platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">2. Booking and Payments</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  2.1. All bookings are subject to availability and confirmation.
                </p>
                <p className="text-muted-foreground">
                  2.2. Prices are displayed in GBP and include VAT where applicable.
                </p>
                <p className="text-muted-foreground">
                  2.3. Payment is required at the time of booking to secure your reservation.
                </p>
                <p className="text-muted-foreground">
                  2.4. We use secure payment processing through Stripe.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">3. Cancellation Policy</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  3.1. Free cancellation is available up to 48 hours before the activity start time.
                </p>
                <p className="text-muted-foreground">
                  3.2. Cancellations made within 48 hours of the activity are non-refundable.
                </p>
                <p className="text-muted-foreground">
                  3.3. Some activities may have specific cancellation policies that override these terms.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">4. User Responsibilities</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  4.1. Users must provide accurate information when making bookings.
                </p>
                <p className="text-muted-foreground">
                  4.2. Users must comply with activity-specific requirements and age restrictions.
                </p>
                <p className="text-muted-foreground">
                  4.3. Users are responsible for arriving at the activity location on time.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">5. Privacy and Data Protection</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  5.1. We collect and process personal data in accordance with our Privacy Policy.
                </p>
                <p className="text-muted-foreground">
                  5.2. User data is protected using industry-standard security measures.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  6.1. We are not responsible for any injuries or accidents that occur during activities.
                </p>
                <p className="text-muted-foreground">
                  6.2. Users participate in activities at their own risk.
                </p>
                <p className="text-muted-foreground">
                  6.3. We recommend having appropriate insurance coverage.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            For any questions about these Terms and Conditions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}