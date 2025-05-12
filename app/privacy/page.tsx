import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 20, 2024</p>

        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                This Privacy Policy explains how Party Pulse collects, uses, and protects your personal information. We are committed to ensuring that your privacy is protected and that we comply with applicable data protection laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">We collect the following types of information:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Name and contact information</li>
                  <li>Booking details and preferences</li>
                  <li>Payment information</li>
                  <li>Device and usage information</li>
                  <li>Communications with our team</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">We use your information to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Process your bookings and payments</li>
                  <li>Communicate about your bookings</li>
                  <li>Improve our services</li>
                  <li>Send relevant marketing communications (with consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
                </p>
                <p className="text-muted-foreground">
                  All payment information is encrypted and processed securely through our payment provider, Stripe.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">You have the right to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Data portability</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">6. Cookies</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to improve your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookies through your browser settings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or how we handle your personal information, please contact us at privacy@partypulse.com.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}