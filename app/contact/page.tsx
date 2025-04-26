"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-xl text-muted-foreground">
          Have a question? We'd love to hear from you
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <div>
          {formSubmitted ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                <p className="mb-6">
                  We've received your message and will get back to you within 24 hours.
                </p>
                <Button
                  onClick={() => setFormSubmitted(false)}
                  variant="outline"
                >
                  Send Another Message
                </Button>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What is your message about?"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here"
                  rows={6}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Send Message
              </Button>
            </form>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-muted-foreground">hello@partypulse.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-muted-foreground">0800 123 4567</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium">Visit Us</p>
                  <p className="text-muted-foreground">
                    Party Pulse HQ<br />
                    123 Celebration Street<br />
                    London, EC1A 1BB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <Card>
            <CardContent className="p-0">
              <div className="relative h-[400px] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.2889612073465!2d-0.09717688422955692!3d51.51492097963633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b553d1b2271%3A0xa32c5e11d4be6bb!2sLondon%20EC1A%201BB%2C%20UK!5e0!3m2!1sen!2sus!4v1647436593867!5m2!1sen!2sus"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          {/* Office Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Office Hours</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="text-muted-foreground">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="text-muted-foreground">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}